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
    },
    tr: {
      backToApplication: "Uygulamaya Dön",
      backToLogin: "Girişe Dön",
      proceedWithAction: "Devam etmek için tıklayın",
      loginSocialWith: "{0} ile giriş yap",
      verifyOAuth2DeviceUserCode: "Kullanıcı kodu",
    },
  })
  .build()

type I18n = typeof ofTypeI18n

export { type I18n, useI18n }
