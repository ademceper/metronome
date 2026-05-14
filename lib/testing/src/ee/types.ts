// Auth is provided by Keycloak. Clerk JWT type is kept as a local stub so
// historical test fixtures referencing ClerkJwtPayload still compile.
export type ClerkJwtPayload = {
  sub?: string
  email?: string
  lastName?: string
  firstName?: string
  profilePicture?: string
  externalId?: string
  externalOrgId?: string
  iat?: number
  exp?: number
  [k: string]: unknown
}
