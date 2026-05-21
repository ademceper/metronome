import { z } from "zod"
import type { I18n } from "../i18n"

export const loginUsernameSchema = (msgStr: I18n["msgStr"]) =>
  z.object({
    username: z
      .string()
      .min(1, msgStr("missingUsernameMessage") || "Username is required"),
    rememberMe: z.boolean().optional(),
  })

export type LoginUsernameFormValues = z.infer<
  ReturnType<typeof loginUsernameSchema>
>
