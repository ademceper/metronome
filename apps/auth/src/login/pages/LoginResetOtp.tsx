import { Button } from "@metronome/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { Fragment } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginResetOtp(
  props: PageProps<Extract<KcContext, { pageId: "login-reset-otp.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, messagesPerField, configuredOtpCredentials } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("totp")}
      headerNode={msg("doLogIn")}
    >
      <form
        id="kc-otp-reset-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <p
          id="kc-otp-reset-form-description"
          className="text-muted-foreground text-sm"
        >
          {msg("otp-reset-description")}
        </p>

        <div className="space-y-2">
          {configuredOtpCredentials.userOtpCredentials.map(
            (otpCredential, index) => (
              <Fragment key={otpCredential.id}>
                <input
                  id={`kc-otp-credential-${index}`}
                  className="peer sr-only"
                  type="radio"
                  name="selectedCredentialId"
                  value={otpCredential.id}
                  defaultChecked={
                    otpCredential.id ===
                    configuredOtpCredentials.selectedCredentialId
                  }
                />
                <label
                  htmlFor={`kc-otp-credential-${index}`}
                  tabIndex={index}
                  className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors hover:bg-muted/50 peer-checked:border-primary peer-checked:bg-primary/5"
                >
                  <span className="font-medium">{otpCredential.userLabel}</span>
                </label>
              </Fragment>
            )
          )}
        </div>

        <Button
          type="submit"
          size="xl"
          id="kc-otp-reset-form-submit"
          className="w-full"
        >
          {msgStr("doSubmit")}
        </Button>
      </form>
    </Template>
  )
}
