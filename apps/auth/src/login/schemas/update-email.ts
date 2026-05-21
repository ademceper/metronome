import { z } from "zod"
import type { I18n } from "../i18n"

export const updateEmailSchema = (msgStr: I18n["msgStr"]) =>
  z.object({
    email: z
      .string()
      .min(1, msgStr("missingEmailMessage") || "Email is required")
      .email(msgStr("invalidEmailMessage") || "Invalid email"),
  })

export type UpdateEmailFormValues = z.infer<
  ReturnType<typeof updateEmailSchema>
>
