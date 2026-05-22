import type { SupportedCredentialConfiguration } from "./supported-credential-configuration"

export interface CredentialsIssuer {
  credential_issuer: string
  credential_endpoint: string
  authorization_servers: string[]
  credential_configurations_supported: Record<
    string,
    SupportedCredentialConfiguration
  >
}
