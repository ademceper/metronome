import { z } from "zod"
import type { I18n } from "../i18n"

export const loginSchema = (msgStr: I18n["msgStr"]) =>
  z.object({
    username: z
      .string()
      .min(1, msgStr("missingUsernameMessage") || "Username is required"),
    password: z
      .string()
      .min(1, msgStr("missingPasswordMessage") || "Password is required"),
    rememberMe: z.boolean().optional(),
  })

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>
