import { Label } from "@metronome/ui/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@metronome/ui/components/radio-group"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useState } from "react"
import { KcField, KcSubmit, KcTextInput } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginOtp(
  props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { otpLogin, url, messagesPerField } = kcContext
  const { msg, msgStr } = i18n

  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasOtpError = messagesPerField.existsError("totp")
  const otpErrorMessage = hasOtpError ? messagesPerField.get("totp") : undefined

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!hasOtpError}
      headerNode={msg("doLogIn")}
    >
      <form
        id="kc-otp-login-form"
        action={url.loginAction}
        onSubmit={() => {
          setIsSubmitting(true)
          return true
        }}
        method="post"
        className="space-y-4"
      >
        {otpLogin.userOtpCredentials.length > 1 && (
          <RadioGroup
            name="selectedCredentialId"
            defaultValue={otpLogin.selectedCredentialId}
            className="space-y-2"
          >
            {otpLogin.userOtpCredentials.map((otpCredential, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md border p-3"
              >
                <RadioGroupItem
                  id={`kc-otp-credential-${index}`}
                  value={otpCredential.id}
                />
                <Label
                  htmlFor={`kc-otp-credential-${index}`}
                  className="cursor-pointer"
                >
                  {otpCredential.userLabel}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <KcField id="otp" label={msg("loginOtpOneTime")}>
          <KcTextInput
            id="otp"
            name="otp"
            autoComplete="one-time-code"
            type="text"
            autoFocus
            invalid={hasOtpError}
          />
          {hasOtpError && otpErrorMessage && (
            <p
              id="input-error-otp-code"
              className="text-destructive text-sm"
              aria-live="polite"
              dangerouslySetInnerHTML={{
                __html: kcSanitize(otpErrorMessage),
              }}
            />
          )}
        </KcField>

        <KcSubmit
          name="login"
          id="kc-login"
          disabled={isSubmitting}
          label={msgStr("doLogIn")}
        />
      </form>
    </Template>
  )
}
