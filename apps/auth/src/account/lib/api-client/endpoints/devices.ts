import type { HttpClient, HttpRequestOptions } from "../client"
import type { DeviceRepresentation } from "../types"

export const devicesEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<DeviceRepresentation[]>("/sessions/devices", opts),

  delete: (id?: string) =>
    http.delete(`/sessions${id ? `/${id}` : ""}`),
})
