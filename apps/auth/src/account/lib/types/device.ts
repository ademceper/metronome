import type { Session } from "./session"

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
