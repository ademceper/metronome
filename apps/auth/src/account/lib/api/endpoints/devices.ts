import type { HttpClient, HttpRequestOptions } from "../../api-client"
import type { Device } from "../../types"

export const devicesEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<Device[]>("/sessions/devices", opts),

  delete: (id?: string) =>
    http.delete(`/sessions${id ? `/${id}` : ""}`),
})
