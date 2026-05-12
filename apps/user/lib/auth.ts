"use client"

import { createAuthClient } from "@metronome/auth"

export const {
  bootstrapOidc,
  useOidc,
  getOidc,
  OidcInitializationGate,
  enforceLogin,
  withLoginEnforced,
  UserButton,
} = createAuthClient()
