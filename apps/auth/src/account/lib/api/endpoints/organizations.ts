import type OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation"
import type { HttpClient, HttpRequestOptions } from "../../api-client"

export const organizationsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<OrganizationRepresentation[]>("/organizations", opts),
})
