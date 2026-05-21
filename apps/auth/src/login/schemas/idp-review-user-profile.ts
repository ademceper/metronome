import { z } from "zod"
import type { I18n } from "../i18n"

export const idpReviewUserProfileSchema = (msgStr: I18n["msgStr"]) =>
  z.object({
    username: z
      .string()
      .min(1, msgStr("missingUsernameMessage") || "Username is required"),
    email: z
      .string()
      .min(1, msgStr("missingEmailMessage") || "Email is required")
      .email(msgStr("invalidEmailMessage") || "Invalid email"),
    firstName: z
      .string()
      .min(1, msgStr("missingFirstNameMessage") || "First name is required"),
    lastName: z
      .string()
      .min(1, msgStr("missingLastNameMessage") || "Last name is required"),
  })

export type IdpReviewUserProfileFormValues = z.infer<
  ReturnType<typeof idpReviewUserProfileSchema>
>
