import { z } from "zod"
import type { I18n } from "../i18n"

/**
 * Validates a Turkish national ID number (T.C. Kimlik No):
 *   – 11 digits, first non-zero;
 *   – d10 = ((odd*7) − even) mod 10  with odd = d1+d3+d5+d7+d9
 *                                          even = d2+d4+d6+d8;
 *   – d11 = (odd + even + d10) mod 10.
 * Keep in sync with TcKimlikValidator.java (server-side enforcement).
 */
export function isValidTcKimlik(value: string): boolean {
  if (!/^[1-9][0-9]{10}$/.test(value)) return false
  const d = value.split("").map((c) => Number(c))
  const odd =
    (d[0] ?? 0) + (d[2] ?? 0) + (d[4] ?? 0) + (d[6] ?? 0) + (d[8] ?? 0)
  const even = (d[1] ?? 0) + (d[3] ?? 0) + (d[5] ?? 0) + (d[7] ?? 0)
  const c10 = (((odd * 7 - even) % 10) + 10) % 10
  const c11 = (odd + even + (d[9] ?? 0)) % 10
  return c10 === d[9] && c11 === d[10]
}

export const registerSchema = (
  msgStr: I18n["msgStr"],
  options: {
    showUsername: boolean
    passwordRequired: boolean
    doMakeUserConfirmPassword: boolean
  }
) => {
  const { showUsername, passwordRequired, doMakeUserConfirmPassword } = options
  const today = new Date()
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )

  return z
    .object({
      // ── Step 1: personal ───────────────────────────────────────────
      firstName: z
        .string()
        .min(1, msgStr("missingFirstNameMessage") || "Ad zorunludur"),
      lastName: z
        .string()
        .min(1, msgStr("missingLastNameMessage") || "Soyad zorunludur"),
      "user.attributes.tcKimlikNo": z
        .string()
        .min(11, "TC Kimlik No 11 haneli olmalıdır")
        .max(11, "TC Kimlik No 11 haneli olmalıdır")
        .refine(isValidTcKimlik, "Geçersiz TC Kimlik No"),
      "user.attributes.birthDate": z
        .string()
        .min(1, "Doğum tarihi zorunludur")
        .refine((s) => !Number.isNaN(Date.parse(s)), "Geçersiz tarih")
        .refine(
          (s) => new Date(s) <= eighteenYearsAgo,
          "En az 18 yaşında olmalısınız"
        ),

      // ── Step 2: contact + auth ─────────────────────────────────────
      username: showUsername
        ? z
            .string()
            .min(
              1,
              msgStr("missingUsernameMessage") || "Kullanıcı adı zorunludur"
            )
        : z.string().optional(),
      email: z
        .string()
        .min(1, msgStr("missingEmailMessage") || "E-posta zorunludur")
        .email(msgStr("invalidEmailMessage") || "Geçersiz e-posta"),
      "user.attributes.phone": z
        .string()
        .min(1, "Telefon numarası zorunludur")
        .regex(/^\+?[0-9]{10,15}$/, "Geçersiz telefon numarası"),
      password: passwordRequired
        ? z
            .string()
            .min(1, msgStr("missingPasswordMessage") || "Şifre zorunludur")
        : z.string().optional(),
      "password-confirm":
        passwordRequired && doMakeUserConfirmPassword
          ? z.string().min(1)
          : z.string().optional(),

      // ── Step 3: consents ───────────────────────────────────────────
      "user.attributes.kvkkAccepted": z.literal("true", {
        message: "KVKK aydınlatma metnini onaylamalısınız",
      }),
      "user.attributes.userAgreementAccepted": z.literal("true", {
        message: "Kullanıcı sözleşmesini onaylamalısınız",
      }),
      "user.attributes.marketingConsent": z
        .union([z.literal("true"), z.literal("false")])
        .optional(),
    })
    .refine(
      (data) =>
        !passwordRequired ||
        !doMakeUserConfirmPassword ||
        data.password === data["password-confirm"],
      {
        path: ["password-confirm"],
        message:
          msgStr("invalidPasswordConfirmMessage") || "Şifreler eşleşmiyor",
      }
    )
}

export type RegisterFormValues = z.infer<ReturnType<typeof registerSchema>>

export const REGISTER_STEPS = [
  {
    id: "personal",
    title: "Kişisel Bilgiler",
    description: "Ad, soyad ve kimlik bilgileri",
    fields: [
      "firstName",
      "lastName",
      "user.attributes.tcKimlikNo",
      "user.attributes.birthDate",
    ],
  },
  {
    id: "contact",
    title: "İletişim ve Güvenlik",
    description: "Hesabınıza erişmek için kullanacağınız bilgiler",
    fields: [
      "username",
      "email",
      "user.attributes.phone",
      "password",
      "password-confirm",
    ],
  },
  {
    id: "consents",
    title: "Onaylar ve Sözleşmeler",
    description:
      "Hizmeti kullanmak için aşağıdaki sözleşmeleri kabul etmelisiniz",
    fields: [
      "user.attributes.kvkkAccepted",
      "user.attributes.userAgreementAccepted",
      "user.attributes.marketingConsent",
    ],
  },
] as const
