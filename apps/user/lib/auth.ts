"use client"

import { createAuthClient } from "@metronome/auth"

export const {
  bootstrapOidc,
  useOidc,
  getOidc,
  OidcInitializationGate,
  OidcInitializationErrorGate,
  UserButton,
} = createAuthClient({ withAutoLogin: true })
