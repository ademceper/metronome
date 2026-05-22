import type { ClientRepresentation } from "./client-representation"

export interface SessionRepresentation {
  id: string
  ipAddress: string
  started: number
  lastAccess: number
  expires: number
  clients: ClientRepresentation[]
  browser: string
  current: boolean
}
