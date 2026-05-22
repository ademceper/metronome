import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../../shared/keycloak-ui-shared"
import { request } from "../client"
import { parseResponse } from "../parse-response"
import type {
  CredentialsIssuer,
  SupportedCredentialConfiguration,
} from "../types"
import { joinPath } from "../../join-path"

export async function getIssuer(context: KeycloakContext<BaseEnvironment>) {
  const path = joinPath(
    "/realms/",
    context.environment.realm,
    "/.well-known/openid-credential-issuer"
  )
  return parseResponse<CredentialsIssuer>(
    await request(
      path,
      context,
      {},
      new URL(joinPath(context.environment.serverBaseUrl, path))
    )
  )
}

export async function requestVCOffer(
  context: KeycloakContext<BaseEnvironment>,
  supportedCredentialConfiguration: SupportedCredentialConfiguration,
  credentialsIssuer: CredentialsIssuer
) {
  const response = await request(
    "/protocol/oid4vc/create-credential-offer",
    context,
    {
      searchParams: {
        credential_configuration_id: supportedCredentialConfiguration.id,
        type: "qr-code",
        width: "500",
        height: "500",
      },
    },
    new URL(
      joinPath(
        credentialsIssuer.credential_issuer +
          "/protocol/oid4vc/create-credential-offer"
      )
    )
  )
  return response.blob()
}
