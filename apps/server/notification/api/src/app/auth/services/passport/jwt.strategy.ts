import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HttpRequestHeaderKeysEnum, Instrument } from '@novu/application-generic';
import {
  EnvironmentRepository,
  OrganizationRepository,
  SubscriberRepository,
  UserEntity,
  UserRepository,
} from '@novu/dal';
import { ApiAuthSchemeEnum, MemberRoleEnum, UserSessionData } from '@novu/shared';
import type http from 'http';
import jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CreateOrganizationCommand } from '../../../organization/usecases/create-organization/create-organization.command';
import { CreateOrganization } from '../../../organization/usecases/create-organization/create-organization.usecase';
import { AuthService } from '../auth.service';
import { addNewRelicTraceAttributes } from './newrelic.util';

type KeycloakClaims = {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  name?: string;
  realm_access?: { roles?: string[] };
};

// Passport invokes `validate()` with the decoded JWT body. Keycloak access
// tokens carry `sub`, `email`, etc. We map that to a local UserSessionData by
// looking the user up by externalId (= Keycloak sub) and auto-provisioning a
// fresh User + Organization on first sight.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private environmentRepository: EnvironmentRepository,
    private userRepository: UserRepository,
    private organizationRepository: OrganizationRepository,
    private subscriberRepository: SubscriberRepository,
    private createOrganizationUsecase: CreateOrganization
  ) {
    const issuerUri =
      process.env.KEYCLOAK_ISSUER_URI ?? 'http://localhost:8080/realms/tiko';
    const jwksClient = jwksRsa({
      jwksUri: `${issuerUri}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      // Accept tokens signed by Keycloak; jwks-rsa resolves the kid to a PEM.
      secretOrKeyProvider: (_req: unknown, rawJwtToken: string, done: (err: Error | null, key?: string) => void) => {
        try {
          const [headerB64] = rawJwtToken.split('.');
          const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
          jwksClient.getSigningKey(header.kid, (err, key) => {
            if (err || !key) return done(err ?? new Error('No signing key'));
            done(null, key.getPublicKey());
          });
        } catch (err) {
          done(err as Error);
        }
      },
      issuer: issuerUri,
      algorithms: ['RS256'],
    });
  }

  @Instrument()
  async validate(req: http.IncomingMessage, claims: KeycloakClaims): Promise<UserSessionData> {
    if (!claims?.sub) throw new UnauthorizedException('Missing sub in token');

    const user = await this.resolveOrProvisionUser(claims);
    const organizationId = await this.resolveOrganizationId(user);
    const environmentId = await this.resolveEnvironmentId(req, organizationId);

    if (environmentId) {
      await this.ensureSubscriber(claims, environmentId, organizationId);
    }

    const session: UserSessionData = {
      _id: user._id,
      organizationId,
      environmentId,
      roles: [MemberRoleEnum.OSS_ADMIN],
      scheme: ApiAuthSchemeEnum.BEARER,
    } as UserSessionData;

    addNewRelicTraceAttributes(session);
    return session;
  }

  private async resolveOrProvisionUser(claims: KeycloakClaims): Promise<UserEntity> {
    const existing = await this.userRepository.findOne({ externalId: claims.sub });
    if (existing) return existing;

    const email = claims.email ?? `${claims.sub}@keycloak.local`;
    const byEmail = await this.userRepository.findByEmail(email);
    if (byEmail) {
      // Backfill externalId so subsequent lookups hit the indexed path.
      await this.userRepository.update({ _id: byEmail._id }, { $set: { externalId: claims.sub } });
      return byEmail;
    }

    const firstName = (claims.given_name ?? claims.preferred_username ?? 'User').toLowerCase();
    const lastName = (claims.family_name ?? '').toLowerCase();

    const created = await this.userRepository.create({
      email,
      firstName,
      lastName,
      externalId: claims.sub,
    });

    await this.createOrganizationUsecase.execute(
      CreateOrganizationCommand.create({
        name: claims.name ?? email,
        userId: created._id,
      })
    );

    const reloaded = await this.userRepository.findById(created._id);
    if (!reloaded) throw new UnauthorizedException('User provisioning failed');
    return reloaded;
  }

  // Mirrors the Keycloak user as a Subscriber in the current environment so
  // that login → both dashboard admin (User) AND notification recipient
  // (Subscriber) are populated in one step. Subscribers are environment-scoped;
  // a new dev env will get its own row on first request to that env.
  private async ensureSubscriber(
    claims: KeycloakClaims,
    environmentId: string,
    organizationId: string
  ): Promise<void> {
    const subscriberId = claims.sub;
    const existing = await this.subscriberRepository.findOne({
      _environmentId: environmentId,
      subscriberId,
    });
    if (existing) return;

    const firstName = claims.given_name ?? claims.preferred_username ?? 'User';
    const lastName = claims.family_name ?? '';

    await this.subscriberRepository.create({
      _environmentId: environmentId,
      _organizationId: organizationId,
      subscriberId,
      firstName,
      lastName,
      email: claims.email,
      data: { externalId: claims.sub, source: 'keycloak' },
    });
  }

  private async resolveOrganizationId(user: UserEntity): Promise<string> {
    const org = await this.organizationRepository.findUserActiveOrganizations(user._id);
    if (!org || org.length === 0) throw new UnauthorizedException('No organization for user');
    return org[0]._id;
  }

  @Instrument()
  private async resolveEnvironmentId(req: http.IncomingMessage, organizationId: string): Promise<string> {
    const headerVal = req.headers[HttpRequestHeaderKeysEnum.NOVU_ENVIRONMENT_ID.toLowerCase()];
    const fromHeader = Array.isArray(headerVal) ? headerVal[0] : headerVal;
    if (fromHeader) return fromHeader;

    const envs = await this.environmentRepository.findOrganizationEnvironments(organizationId);
    return envs?.[0]?._id ?? '';
  }
}
