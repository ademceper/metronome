import type { HttpClient, HttpRequestOptions } from "../api-client"

/* ─── DTOs ────────────────────────────────────────────────────────── */

export interface UserProfileAttributeMetadata {
  name: string
  displayName: string
  required: boolean
  readOnly: boolean
  annotations?: { [index: string]: any }
  validators: { [index: string]: { [index: string]: any } }
  multivalued: boolean
  defaultValue: string
}

export interface UserProfileMetadata {
  attributes: UserProfileAttributeMetadata[]
}

export type User = any & {
  userProfileMetadata: UserProfileMetadata
}

/* ─── Endpoints ───────────────────────────────────────────────────── */

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
