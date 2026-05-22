import type { SessionRepresentation } from "./session-representation"

export interface DeviceRepresentation {
  id: string
  ipAddress: string
  os: string
  osVersion: string
  browser: string
  device: string
  lastAccess: number
  current: boolean
  sessions: SessionRepresentation[]
  mobile: boolean
}
