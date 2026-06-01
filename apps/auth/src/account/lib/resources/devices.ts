import type { HttpClient, HttpRequestOptions } from "../api-client"
import type { Application } from "./applications"

/* ─── DTOs ────────────────────────────────────────────────────────── */

export interface Session {
  id: string
  ipAddress: string
  started: number
  lastAccess: number
  expires: number
  clients: Application[]
  browser: string
  current: boolean
}

export interface Device {
  id: string
  ipAddress: string
  os: string
  osVersion: string
  browser: string
  device: string
  lastAccess: number
  current: boolean
  sessions: Session[]
  mobile: boolean
}

/* ─── Endpoints ───────────────────────────────────────────────────── */

export const devicesEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<Device[]>("/sessions/devices", opts),

  delete: (id?: string) => http.delete(`/sessions${id ? `/${id}` : ""}`),
})
