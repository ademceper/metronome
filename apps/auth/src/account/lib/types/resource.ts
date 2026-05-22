import type { Client } from "./client"
import type { Permission } from "./permission"
import type { Scope } from "./scope"

export interface Resource {
  _id: string
  name: string
  client: Client
  scopes: Scope[]
  uris: string[]
  shareRequests?: Permission[]
}
