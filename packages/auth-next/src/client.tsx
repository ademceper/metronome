"use client"

import { Profile, type ProfileProps } from "@metronome/auth"
import {
  SessionProvider,
  type SessionProviderProps,
  signOut,
  useSession,
} from "next-auth/react"
import type { ComponentType, ReactNode } from "react"

// Re-export the underlying NextAuth hooks so apps can drop down when needed.
export { signIn, signOut, useSession } from "next-auth/react"
export type Session = SessionProviderProps["session"]

/**
 * Clerk-style conditional render: only paints children when the user is
 * authenticated. Pair with <SignedOut> to gate UI without writing your own
 * useSession check.
 */
export function SignedIn({ children }: { children: ReactNode }) {
  const { status } = useSession()
  return status === "authenticated" ? <>{children}</> : null
}

/**
 * Clerk-style conditional render: only paints children when the user is
 * NOT authenticated (loading is treated as signed-out so the public UI
 * shows immediately).
 */
export function SignedOut({ children }: { children: ReactNode }) {
  const { status } = useSession()
  return status === "unauthenticated" ? <>{children}</> : null
}

/**
 * Wraps children in NextAuth's SessionProvider. Use at the top of the
 * Next.js root layout (client boundary).
 */
export function AuthProvider({
  children,
  session,
}: {
  children: ReactNode
  session?: SessionProviderProps["session"]
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

/**
 * Convenience hook: returns a Clerk-like { user, isLoaded } shape backed
 * by the NextAuth session.
 */
export function useUser(): {
  user: {
    name: string | null | undefined
    email: string | null | undefined
    image: string | null | undefined
  } | null
  isLoaded: boolean
} {
  const { data, status } = useSession()
  return {
    user: data?.user
      ? {
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        }
      : null,
    isLoaded: status !== "loading",
  }
}

export type UserButtonProps = {
  children?: ReactNode
  signOutLabel?: string
  align?: ProfileProps["align"]
  className?: string
  /** Override the fallback avatar (default `/images/avatar.svg`). */
  fallbackAvatarUrl?: string
  /** Override the auto-derived Keycloak account console URL. By default
   *  resolved to `${session.issuer}/account` from the OIDC claims. Pass
   *  `null` to hide the Account menu item. */
  accountUrl?: string | null
  accountLabel?: string
}

/**
 * NextAuth-bound UserButton. Same visual as @metronome/auth's UserButton
 * but driven by the NextAuth session.
 *
 * Sign out is federated: we first hit Keycloak's end_session_endpoint
 * with id_token_hint so the SSO session terminates, then NextAuth clears
 * the local cookie. Without this the middleware would silently re-auth
 * the user via the still-live Keycloak session.
 */
export const UserButton: ComponentType<UserButtonProps> = function UserButton({
  children,
  signOutLabel,
  align,
  className,
  fallbackAvatarUrl,
  accountUrl,
  accountLabel,
}) {
  const { data, status } = useSession()
  if (status !== "authenticated" || !data?.user) return null

  const session = data as typeof data & { idToken?: string; issuer?: string }

  // Auto-derive from Keycloak issuer when caller didn't override and the
  // session carries the issuer claim. Pass `null` to hide.
  const resolvedAccountUrl =
    accountUrl === null
      ? undefined
      : (accountUrl ??
        (session.issuer ? `${session.issuer}/account` : undefined))

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    if (session.issuer && session.idToken) {
      const url = new URL(`${session.issuer}/protocol/openid-connect/logout`)
      url.searchParams.set("id_token_hint", session.idToken)
      url.searchParams.set("post_logout_redirect_uri", window.location.origin)
      window.location.href = url.toString()
    } else {
      window.location.href = "/"
    }
  }

  return (
    <Profile
      name={data.user.name ?? undefined}
      email={data.user.email ?? undefined}
      avatarUrl={data.user.image ?? undefined}
      fallbackAvatarUrl={fallbackAvatarUrl}
      accountUrl={resolvedAccountUrl}
      accountLabel={accountLabel}
      onSignOut={handleSignOut}
      signOutLabel={signOutLabel}
      align={align}
      className={className}
    >
      {children}
    </Profile>
  )
}
