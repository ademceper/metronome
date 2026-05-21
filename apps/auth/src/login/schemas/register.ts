import { z } from "zod"
import type { I18n } from "../i18n"

export const registerSchema = (
  msgStr: I18n["msgStr"],
  options: {
    showUsername: boolean
    passwordRequired: boolean
    doMakeUserConfirmPassword: boolean
  }
) => {
  const { showUsername, passwordRequired, doMakeUserConfirmPassword } = options
  return z
    .object({
      username: showUsername
        ? z
            .string()
            .min(1, msgStr("missingUsernameMessage") || "Username is required")
        : z.string().optional(),
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
      password: passwordRequired
        ? z
            .string()
            .min(1, msgStr("missingPasswordMessage") || "Password is required")
        : z.string().optional(),
      "password-confirm":
        passwordRequired && doMakeUserConfirmPassword
          ? z.string().min(1)
          : z.string().optional(),
    })
    .refine(
      (data) =>
        !passwordRequired ||
        !doMakeUserConfirmPassword ||
        data.password === data["password-confirm"],
      {
        path: ["password-confirm"],
        message:
          msgStr("invalidPasswordConfirmMessage") || "Passwords do not match",
      }
    )
}

export type RegisterFormValues = z.infer<ReturnType<typeof registerSchema>>
