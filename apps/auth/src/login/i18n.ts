/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login"
import type { ThemeName } from "../kc.gen"

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      backToApplication: "Back to Application",
      backToLogin: "Back to Login",
      proceedWithAction: "Click here to proceed",
      loginSocialWith: "Sign in with {0}",
      verifyOAuth2DeviceUserCode: "User code",
      // Custom user-profile attribute display names
      "profile.attributes.tcKimlikNo": "Turkish ID Number",
      "profile.attributes.birthDate": "Date of birth",
      "profile.attributes.phone": "Phone",
      "profile.attributes.kvkkAccepted":
        "I have read and accept the privacy notice (KVKK)",
      "profile.attributes.userAgreementAccepted": "I accept the user agreement",
      "profile.attributes.marketingConsent":
        "Send me marketing communications (optional)",
      // Validator error messages (matches SPI / built-in keys)
      "error-tc-kimlik-invalid": "Invalid Turkish ID number",
      "error-too-young": "You must be at least {0} years old",
      "error-invalid-date": "Invalid date",
      "error-phone-invalid": "Invalid phone number",
    },
    tr: {
      backToApplication: "Uygulamaya Dön",
      backToLogin: "Girişe Dön",
      proceedWithAction: "Devam etmek için tıklayın",
      loginSocialWith: "{0} ile giriş yap",
      verifyOAuth2DeviceUserCode: "Kullanıcı kodu",
      "profile.attributes.tcKimlikNo": "TC Kimlik No",
      "profile.attributes.birthDate": "Doğum Tarihi",
      "profile.attributes.phone": "Telefon",
      "profile.attributes.kvkkAccepted":
        "KVKK Aydınlatma Metni'ni okudum, kabul ediyorum",
      "profile.attributes.userAgreementAccepted":
        "Kullanıcı Sözleşmesi'ni kabul ediyorum",
      "profile.attributes.marketingConsent":
        "Ticari elektronik ileti gönderilmesini onaylıyorum (opsiyonel)",
      "error-tc-kimlik-invalid": "Geçersiz TC Kimlik No",
      "error-too-young": "En az {0} yaşında olmalısınız",
      "error-invalid-date": "Geçersiz tarih",
      "error-phone-invalid": "Geçersiz telefon numarası",
    },
  })
  .build()

type I18n = typeof ofTypeI18n

export { type I18n, useI18n }
