import type { Application } from "./application"

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
