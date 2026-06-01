import type OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation"
import type { HttpClient, HttpRequestOptions } from "../api-client"

/* Re-export the upstream Organization shape under a local alias */
export type Organization = OrganizationRepresentation

/* ─── Endpoints ───────────────────────────────────────────────────── */

export const organizationsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<Organization[]>("/organizations", opts),
})
