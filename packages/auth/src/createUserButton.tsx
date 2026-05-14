import type { ComponentType, ReactNode } from "react"
import { Profile, type ProfileProps } from "./Profile"

type ResolveClaim<D> = (claims: D) => string | undefined

type UserButtonProps<D> = {
  children?: ReactNode
  resolveName?: ResolveClaim<D>
  resolveEmail?: ResolveClaim<D>
  resolveAvatarUrl?: ResolveClaim<D>
  fallbackAvatarUrl?: string
  signOutLabel?: string
  align?: ProfileProps["align"]
  className?: string
}

type AnyUseOidc = (params?: { assert?: undefined }) => {
  isUserLoggedIn: boolean
  decodedIdToken?: any
  logout?: (p: { redirectTo: "current page" }) => Promise<never>
}

/**
 * Internal factory. Binds a Clerk-style avatar+dropdown component to the
 * caller's oidc-spa `useOidc` hook so consumers don't have to thread user
 * data through props.
 */
export function createUserButton<D extends Record<string, unknown>>(
  useOidc: AnyUseOidc
): ComponentType<UserButtonProps<D>> {
  return function UserButton({
    children,
    resolveName,
    resolveEmail,
    resolveAvatarUrl,
    fallbackAvatarUrl,
    signOutLabel,
    align,
    className,
  }: UserButtonProps<D>) {
    const oidc = useOidc()
    if (!oidc.isUserLoggedIn) return null

    const claims = oidc.decodedIdToken as D & {
      name?: string
      preferred_username?: string
      email?: string
      picture?: string
    }

    const name = resolveName
      ? resolveName(claims)
      : claims.name || claims.preferred_username
    const email = resolveEmail ? resolveEmail(claims) : claims.email
    const avatarUrl = resolveAvatarUrl
      ? resolveAvatarUrl(claims)
      : claims.picture

    return (
      <Profile
        name={name}
        email={email}
        avatarUrl={avatarUrl}
        fallbackAvatarUrl={fallbackAvatarUrl}
        onSignOut={() => oidc.logout?.({ redirectTo: "current page" })}
        signOutLabel={signOutLabel}
        align={align}
        className={className}
      >
        {children}
      </Profile>
    )
  }
}
