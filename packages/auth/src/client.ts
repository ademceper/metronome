import { UserManager } from "oidc-client-ts"
import type { AuthConfig } from "./types"

export function createUserManager(config: AuthConfig) {
  return new UserManager(config)
}
