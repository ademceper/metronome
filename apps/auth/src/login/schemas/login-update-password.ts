import { z } from "zod"
import type { I18n } from "../i18n"

export const loginUpdatePasswordSchema = (msgStr: I18n["msgStr"]) =>
  z
    .object({
      password: z
        .string()
        .min(1, msgStr("missingPasswordMessage") || "Password is required"),
      passwordConfirm: z
        .string()
        .min(1, msgStr("missingPasswordMessage") || "Password is required"),
      logoutSessions: z.boolean().optional(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: msgStr("notMatchPasswordMessage") || "Passwords do not match",
    })

export type LoginUpdatePasswordFormValues = z.infer<
  ReturnType<typeof loginUpdatePasswordSchema>
>
