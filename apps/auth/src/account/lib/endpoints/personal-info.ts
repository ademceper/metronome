import type { HttpClient, HttpRequestOptions } from "../api-client"
import type { User } from "../types"

export const personalInfoEndpoints = (http: HttpClient) => ({
  get: (opts?: HttpRequestOptions) =>
    http.get<User>("/?userProfileMetadata=true", opts),

  supportedLocales: (opts?: HttpRequestOptions) =>
    http.get<string[]>("/supportedLocales", opts),

  update: async (info: User) => {
    const response = await http.raw("/", { method: "POST", body: info })
    if (!response.ok) {
      const { errors } = await response.json()
      throw errors
    }
  },
})
