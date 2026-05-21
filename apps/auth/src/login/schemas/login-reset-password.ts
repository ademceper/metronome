import { z } from "zod"
import type { I18n } from "../i18n"

export const loginResetPasswordSchema = (msgStr: I18n["msgStr"]) =>
  z.object({
    username: z
      .string()
      .min(1, msgStr("missingUsernameMessage") || "Username is required"),
  })

export type LoginResetPasswordFormValues = z.infer<
  ReturnType<typeof loginResetPasswordSchema>
>
