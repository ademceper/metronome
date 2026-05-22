import type { CredentialMetadata } from "./credential-metadata"
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
  userCredentialMetadatas: CredentialMetadata[]
  metadata: CredentialTypeMetadata
}
