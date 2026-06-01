import type { HttpClient, HttpRequestOptions } from "../api-client"

/* ─── DTOs ────────────────────────────────────────────────────────── */

export interface Credential {
  id: string
  type: string
  userLabel: string
  createdDate: number
  secretData: string
  credentialData: string
  priority: number
  value: string
  temporary: boolean
  /** @deprecated */ device: string
  /** @deprecated */ hashedSaltedValue: string
  /** @deprecated */ salt: string
  /** @deprecated */ hashIterations: number
  /** @deprecated */ counter: number
  /** @deprecated */ algorithm: string
  /** @deprecated */ digits: number
  /** @deprecated */ period: number
  /** @deprecated */ config: { [index: string]: string[] }
}

export interface CredentialMetadataMessage {
  key: string
  parameters?: string[]
}

export interface CredentialMetadata {
  infoMessage: CredentialMetadataMessage
  infoProperties: CredentialMetadataMessage[]
  warningMessageTitle: CredentialMetadataMessage
  warningMessageDescription: CredentialMetadataMessage
  credential: Credential
}

export interface CredentialTypeMetadata {
  type: string
  displayName: string
  helpText: string
  iconCssClass: string
  createAction: string
  updateAction: string
  removeable: boolean
  category: "basic-authentication" | "two-factor" | "passwordless"
}

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

/* ─── Endpoints ───────────────────────────────────────────────────── */

export const credentialsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<CredentialContainer[]>("/credentials", opts),
})
