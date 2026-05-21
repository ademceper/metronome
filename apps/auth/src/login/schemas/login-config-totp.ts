import { z } from "zod"
import type { I18n } from "../i18n"

export const loginConfigTotpSchema = (
  msgStr: I18n["msgStr"],
  userLabelRequired: boolean
) =>
  z.object({
    totp: z.string().min(1, msgStr("missingTotpMessage") || "Code is required"),
    userLabel: userLabelRequired
      ? z.string().min(1, "Device name is required")
      : z.string().optional(),
    logoutSessions: z.boolean().optional(),
  })

export type LoginConfigTotpFormValues = z.infer<
  ReturnType<typeof loginConfigTotpSchema>
>
