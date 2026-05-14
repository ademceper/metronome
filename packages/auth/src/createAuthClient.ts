import type { Oidc as Oidc_core } from "oidc-spa/core"
import type { OidcSpaUtils } from "oidc-spa/react-spa"
import { oidcSpa } from "oidc-spa/react-spa"
import type { ComponentType, ReactNode } from "react"
import { createUserButton } from "./createUserButton"
import type { ProfileProps } from "./Profile"

export type DefaultClaims = Oidc_core.Tokens.DecodedIdToken_OidcCoreSpec

export type ZodSchemaLike<I, O> = { parse(input: I): O }

export type CreateAuthClientOptions<D extends Record<string, unknown>> = {
  /** Force every page through the OIDC login redirect. Removes withLoginEnforced/enforceLogin. */
  withAutoLogin?: boolean
  /** Narrow the decoded id-token shape (Zod-compatible: anything with `.parse()`). */
  decodedIdTokenSchema?: ZodSchemaLike<DefaultClaims, D>
  /** Dev/Storybook mock for the decoded id token. */
  decodedIdToken_mock?: D
}

export type UserButtonProps = {
  /** Extra DropdownMenuItem(s) inserted above the standard Sign Out item. */
  children?: ReactNode
  /** Pick the name claim. Defaults to `name ?? preferred_username`. */
  resolveName?: (claims: any) => string | undefined
  /** Pick the email claim. Defaults to `email`. */
  resolveEmail?: (claims: any) => string | undefined
  /** Pick the avatar URL claim. Defaults to `picture`. */
  resolveAvatarUrl?: (claims: any) => string | undefined
  /** Used when claim has no picture. Defaults to `/images/avatar.svg`. */
  fallbackAvatarUrl?: string
  signOutLabel?: string
  align?: ProfileProps["align"]
  className?: string
}

export type AuthClient<
  AutoLogin extends boolean,
  D extends Record<string, unknown>,
> = OidcSpaUtils<AutoLogin, D> & {
  UserButton: ComponentType<UserButtonProps>
}

export function createAuthClient<
  D extends Record<string, unknown> = DefaultClaims,
  AutoLogin extends boolean = false,
>(
  options?: CreateAuthClientOptions<D> & { withAutoLogin?: AutoLogin }
): AuthClient<AutoLogin, D> {
  let builder: any = oidcSpa

  if (options?.decodedIdTokenSchema) {
    builder = builder.withExpectedDecodedIdTokenShape({
      decodedIdTokenSchema: options.decodedIdTokenSchema,
      decodedIdToken_mock: options.decodedIdToken_mock,
    })
  }

  if (options?.withAutoLogin) {
    builder = builder.withAutoLogin()
  }

  const utils = builder.createUtils() as OidcSpaUtils<AutoLogin, D>

  const UserButton = createUserButton(utils.useOidc as any)

  return { ...utils, UserButton }
}
