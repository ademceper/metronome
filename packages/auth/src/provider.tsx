import type { UserManager } from "oidc-client-ts"
import {
  createContext,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"
import { createUserManager } from "./client"
import type { AuthConfig, AuthState } from "./types"

export type AuthContextValue = AuthState & {
  manager: UserManager
  signIn: (args?: { state?: unknown }) => Promise<void>
  signOut: () => Promise<void>
  getAccessToken: () => Promise<string | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export type AuthProviderProps = {
  config: AuthConfig
  children: ReactNode
  /** If true, automatically handles ?code=... redirect callbacks. */
  autoHandleCallback?: boolean
}

export function AuthProvider({
  config,
  children,
  autoHandleCallback = true,
}: AuthProviderProps) {
  const manager = useMemo(() => createUserManager(config), [config])
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    const handleUser = (user: Awaited<ReturnType<UserManager["getUser"]>>) => {
      if (cancelled) return
      setState({
        status: user && !user.expired ? "authenticated" : "unauthenticated",
        user,
        error: null,
      })
    }

    const handleError = (error: unknown) => {
      if (cancelled) return
      setState({
        status: "error",
        user: null,
        error: error instanceof Error ? error : new Error(String(error)),
      })
    }

    const init = async () => {
      try {
        if (
          autoHandleCallback &&
          typeof window !== "undefined" &&
          window.location.search.includes("code=")
        ) {
          const user = await manager.signinRedirectCallback()
          handleUser(user)
          return
        }
        const user = await manager.getUser()
        handleUser(user)
      } catch (error) {
        handleError(error)
      }
    }

    void init()

    const onLoaded = (user: Awaited<ReturnType<UserManager["getUser"]>>) =>
      handleUser(user)
    const onUnloaded = () =>
      setState({ status: "unauthenticated", user: null, error: null })
    const onError = (error: Error) => handleError(error)

    manager.events.addUserLoaded(onLoaded)
    manager.events.addUserUnloaded(onUnloaded)
    manager.events.addSilentRenewError(onError)

    return () => {
      cancelled = true
      manager.events.removeUserLoaded(onLoaded)
      manager.events.removeUserUnloaded(onUnloaded)
      manager.events.removeSilentRenewError(onError)
    }
  }, [manager, autoHandleCallback])

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      manager,
      signIn: (args) => manager.signinRedirect({ state: args?.state }),
      signOut: () => manager.signoutRedirect(),
      getAccessToken: async () => {
        const user = await manager.getUser()
        return user && !user.expired ? user.access_token : null
      },
    }),
    [state, manager]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
