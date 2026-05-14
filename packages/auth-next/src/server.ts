import NextAuth, { type NextAuthConfig, type NextAuthResult } from "next-auth"

export type CreateAuthOptions = {
  /** OIDC issuer URI, e.g. http://localhost:8080/realms/tiko */
  issuerUri: string
  /** OIDC client_id */
  clientId: string
  /** Optional client secret. Public clients (PKCE) leave this undefined. */
  clientSecret?: string
  /** Additional NextAuth config (callbacks, pages, etc.) merged on top. */
  override?: Partial<NextAuthConfig>
}

/**
 * Build a NextAuth instance bound to a generic OIDC provider. Returns the
 * same shape as `NextAuth(config)` so consumers can re-export `auth`,
 * `handlers`, `signIn`, `signOut` from their app's `auth.ts`.
 *
 * Usage in apps/<app>/auth.ts:
 *
 *   export const { auth, handlers, signIn, signOut } = createAuth({
 *     issuerUri: process.env.OIDC_ISSUER_URI!,
 *     clientId: process.env.OIDC_CLIENT_ID!,
 *   })
 */
export function createAuth({
  issuerUri,
  clientId,
  clientSecret,
  override,
}: CreateAuthOptions): NextAuthResult {
  const config: NextAuthConfig = {
    trustHost: true,
    // Custom sign-in route. Apps render apps/<app>/app/sign-in/page.tsx
    // as a Server Component that calls signIn("oidc") — server-side
    // NEXT_REDIRECT sends the browser straight to Keycloak.
    pages: { signIn: "/sign-in" },
    providers: [
      {
        id: "oidc",
        name: "OIDC",
        type: "oidc",
        issuer: issuerUri,
        clientId,
        clientSecret,
        // PKCE for public clients (no secret).
        checks: clientSecret ? ["state"] : ["pkce", "state"],
      },
    ],
    callbacks: {
      // Gate every request the middleware sees. Returning false makes
      // NextAuth redirect to pages.signIn (/sign-in), where the app's
      // Server Component calls signIn("oidc") and triggers a server-side
      // redirect to Keycloak. Browser never renders a picker.
      authorized({ auth }) {
        return !!auth
      },
      // Surface raw OIDC claims on the session so UserButton can read them.
      // Also keep id_token + issuer URL so federated logout can terminate
      // the Keycloak session on sign out.
      async jwt({ token, profile, account }) {
        if (profile) {
          token.name = profile.name ?? token.name
          token.email = profile.email ?? token.email
          token.picture = profile.picture ?? token.picture
          token.sub = profile.sub ?? token.sub
        }
        if (account?.id_token) {
          token.idToken = account.id_token
          token.issuer = (account.provider_issuer as string) ?? issuerUri
        }
        return token
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.name = token.name ?? session.user.name
          session.user.email = token.email ?? session.user.email
          session.user.image = (token.picture as string) ?? session.user.image
        }
        ;(session as { idToken?: string }).idToken = token.idToken as
          | string
          | undefined
        ;(session as { issuer?: string }).issuer = token.issuer as
          | string
          | undefined
        return session
      },
    },
    ...override,
  }

  return NextAuth(config)
}
