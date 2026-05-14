"use client"

import { Profile, type ProfileProps } from "@metronome/auth"
import {
  SessionProvider,
  type SessionProviderProps,
  signOut,
  useSession,
} from "next-auth/react"
import type { ComponentType, ReactNode } from "react"

// Re-export the underlying NextAuth hook so apps can drop down when needed.
export { signIn, signOut, useSession } from "next-auth/react"

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
}

/**
 * NextAuth-bound UserButton. Same visual as @metronome/auth's UserButton
 * but driven by the NextAuth session.
 */
export const UserButton: ComponentType<UserButtonProps> = function UserButton({
  children,
  signOutLabel,
  align,
  className,
  fallbackAvatarUrl,
}) {
  const { data, status } = useSession()
  if (status !== "authenticated" || !data?.user) return null

  return (
    <Profile
      name={data.user.name ?? undefined}
      email={data.user.email ?? undefined}
      avatarUrl={data.user.image ?? undefined}
      fallbackAvatarUrl={fallbackAvatarUrl}
      onSignOut={() => signOut({ redirectTo: "/" })}
      signOutLabel={signOutLabel}
      align={align}
      className={className}
    >
      {children}
    </Profile>
  )
}
