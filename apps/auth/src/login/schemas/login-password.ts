import { z } from "zod"
import type { I18n } from "../i18n"

export const loginPasswordSchema = (msgStr: I18n["msgStr"]) =>
  z.object({
    password: z
      .string()
      .min(1, msgStr("missingPasswordMessage") || "Password is required"),
  })

export type LoginPasswordFormValues = z.infer<
  ReturnType<typeof loginPasswordSchema>
>
