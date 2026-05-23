import type { HttpClient, HttpRequestOptions } from "../../api-client"
import type { CredentialContainer } from "../../types"

export const credentialsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<CredentialContainer[]>("/credentials", opts),
})
