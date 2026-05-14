// One-liner route handler re-export. App usage:
//   // apps/<app>/app/api/auth/[...nextauth]/route.ts
//   export { GET, POST } from "@metronome/auth-next/route"

import type { NextAuthResult } from "next-auth"
import { getNextAuth } from "./internal"

const { handlers } = getNextAuth()
export const GET: NextAuthResult["handlers"]["GET"] = handlers.GET
export const POST: NextAuthResult["handlers"]["POST"] = handlers.POST
