import type { Scope } from "./scope"

export interface Permission {
  email?: string
  firstName?: string
  lastName?: string
  scopes: Scope[] | string[]
  username: string
}
