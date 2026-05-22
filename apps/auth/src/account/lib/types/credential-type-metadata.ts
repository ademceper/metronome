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
