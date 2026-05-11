import type { User, UserManagerSettings } from "oidc-client-ts"

export type AuthConfig = UserManagerSettings

export type AuthUser = User

export type AuthStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated"
  | "error"

export type AuthState = {
  status: AuthStatus
  user: AuthUser | null
  error: Error | null
}
