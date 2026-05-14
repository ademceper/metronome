import { getOidc } from "@/auth-client"

export async function getToken(): Promise<string> {
  const oidc = await getOidc({ assert: "user logged in" })
  return oidc.getAccessToken()
}
