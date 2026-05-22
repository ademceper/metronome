/**
 * The owning client of a `Resource` — note this is distinct from the
 * larger `ClientRepresentation` returned by /applications.
 */
export interface Client {
  baseUrl: string
  clientId: string
  name?: string
}
