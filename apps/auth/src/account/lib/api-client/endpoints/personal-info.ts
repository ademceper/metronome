import type { HttpClient, HttpRequestOptions } from "../client"
import type { UserRepresentation } from "../types"

export const personalInfoEndpoints = (http: HttpClient) => ({
  get: (opts?: HttpRequestOptions) =>
    http.get<UserRepresentation>("/?userProfileMetadata=true", opts),

  supportedLocales: (opts?: HttpRequestOptions) =>
    http.get<string[]>("/supportedLocales", opts),

  update: async (info: UserRepresentation) => {
    const response = await http.raw("/", { method: "POST", body: info })
    if (!response.ok) {
      const { errors } = await response.json()
      throw errors
    }
  },
})
