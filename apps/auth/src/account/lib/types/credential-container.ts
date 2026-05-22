import type { CredentialMetadataRepresentation } from "./credential-metadata-representation"
import type { CredentialTypeMetadata } from "./credential-type-metadata"

export interface CredentialContainer {
  type: string
  category: string
  displayName: string
  helptext: string
  iconCssClass: string
  createAction: string
  updateAction: string
  removeable: boolean
  userCredentialMetadatas: CredentialMetadataRepresentation[]
  metadata: CredentialTypeMetadata
}
