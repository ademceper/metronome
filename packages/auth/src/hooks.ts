import { useContext } from "react"
import { AuthContext, type AuthContextValue } from "./provider"

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>")
  }
  return ctx
}

export function useUser() {
  return useAuth().user
}

export function useIsAuthenticated() {
  return useAuth().status === "authenticated"
}
