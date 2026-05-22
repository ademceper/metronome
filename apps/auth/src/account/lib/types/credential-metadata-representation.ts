import type { CredentialMetadataRepresentationMessage } from "./credential-metadata-representation-message"
import type { CredentialRepresentation } from "./credential-representation"

export interface CredentialMetadataRepresentation {
  infoMessage: CredentialMetadataRepresentationMessage
  infoProperties: CredentialMetadataRepresentationMessage[]
  warningMessageTitle: CredentialMetadataRepresentationMessage
  warningMessageDescription: CredentialMetadataRepresentationMessage
  credential: CredentialRepresentation
}
