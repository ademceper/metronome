import type { CredentialMetadataMessage } from "./credential-metadata-message"
import type { Credential } from "./credential"

export interface CredentialMetadata {
  infoMessage: CredentialMetadataMessage
  infoProperties: CredentialMetadataMessage[]
  warningMessageTitle: CredentialMetadataMessage
  warningMessageDescription: CredentialMetadataMessage
  credential: Credential
}
