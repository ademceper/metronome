"use client"

import {
  AuthProvider as NextAuthProvider,
  type Session,
} from "@metronome/auth-next/client"
import type { ReactNode } from "react"

export function AuthProvider({
  children,
  session,
}: {
  children: ReactNode
  session?: Session
}) {
  return <NextAuthProvider session={session}>{children}</NextAuthProvider>
}
