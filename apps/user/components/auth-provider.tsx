"use client"

import { AuthProvider as NextAuthProvider } from "@metronome/auth-next/client"
import type { ReactNode } from "react"

export function AuthProvider({ children }: { children: ReactNode }) {
  return <NextAuthProvider>{children}</NextAuthProvider>
}
