import React from 'react';
import { useOidc } from '@/auth-client';
import { createContextHook } from '../context';
import { SelfHostedUser } from './user.types';

type KeycloakClaims = {
  sub?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
};

function claimsToUser(claims: KeycloakClaims): SelfHostedUser {
  return {
    update: async () => null,
    reload: async () => null,
    externalId: claims.sub ?? 'unknown',
    firstName: claims.given_name ?? claims.preferred_username ?? 'User',
    lastName: claims.family_name ?? '',
    emailAddresses: [{ emailAddress: claims.email ?? 'unknown@local' }],
    createdAt: new Date(),
    publicMetadata: { newDashboardOptInStatus: 'opted_in' },
    unsafeMetadata: { newDashboardOptInStatus: 'opted_in' },
    organizationMemberships: [{}],
    passwordEnabled: true,
  };
}

export const AuthContext = React.createContext({});

export function AuthContextProvider({ children }: any) {
  const oidc = useOidc();
  const currentUser = oidc.isUserLoggedIn
    ? claimsToUser(oidc.decodedIdToken as KeycloakClaims)
    : null;

  return (
    <AuthContext.Provider value={{ currentUser, has: () => true }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = createContextHook(AuthContext);
