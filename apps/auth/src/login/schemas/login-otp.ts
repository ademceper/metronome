import { z } from "zod"
import type { I18n } from "../i18n"

export const loginOtpSchema = (msgStr: I18n["msgStr"]) =>
  z.object({
    otp: z.string().min(1, msgStr("missingTotpMessage") || "OTP is required"),
    selectedCredentialId: z.string().optional(),
  })

export type LoginOtpFormValues = z.infer<ReturnType<typeof loginOtpSchema>>
