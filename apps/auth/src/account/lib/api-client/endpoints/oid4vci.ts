import { joinPath } from "../../join-path"
import type { HttpClient } from "../client"
import { parseResponse } from "../parse-response"
import type {
  CredentialsIssuer,
  SupportedCredentialConfiguration,
} from "../types"

/**
 * oid4vci endpoints reach outside the account API base URL (the issuer
 * lives at the realm root and the offer endpoint at a custom protocol
 * path), so they use `http.raw` with an explicit fullUrl.
 */
export const oid4vciEndpoints = (
  http: HttpClient,
  baseUrl: string,
  realm: string,
) => ({
  issuer: async () => {
    const path = joinPath(
      "/realms/",
      realm,
      "/.well-known/openid-credential-issuer",
    )
    const response = await http.raw(path, {
      fullUrl: new URL(joinPath(baseUrl, path)),
    })
    return parseResponse<CredentialsIssuer>(response)
  },

  createOffer: async (
    config: SupportedCredentialConfiguration,
    issuer: CredentialsIssuer,
  ) => {
    const response = await http.raw(
      "/protocol/oid4vc/create-credential-offer",
      {
        fullUrl: new URL(
          joinPath(
            issuer.credential_issuer +
              "/protocol/oid4vc/create-credential-offer",
          ),
        ),
        searchParams: {
          credential_configuration_id: config.id,
          type: "qr-code",
          width: "500",
          height: "500",
        },
      },
    )
    return response.blob()
  },
})
