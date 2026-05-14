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
    // Skip NextAuth's built-in "Sign in with OIDC" picker by sending users
    // to /sign-in, where apps render a tiny page that immediately calls
    // signIn("oidc") and forwards to Keycloak.
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
      // NextAuth send the user through pages.signIn (default /sign-in),
      // which apps wire to immediately call signIn("oidc") — skipping
      // the built-in provider picker.
      authorized({ auth }) {
        return !!auth
      },
      // Surface raw OIDC claims on the session so UserButton can read them.
      async jwt({ token, profile }) {
        if (profile) {
          token.name = profile.name ?? token.name
          token.email = profile.email ?? token.email
          token.picture = profile.picture ?? token.picture
          token.sub = profile.sub ?? token.sub
        }
        return token
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.name = token.name ?? session.user.name
          session.user.email = token.email ?? session.user.email
          session.user.image = (token.picture as string) ?? session.user.image
        }
        return session
      },
    },
    ...override,
  }

  return NextAuth(config)
}
