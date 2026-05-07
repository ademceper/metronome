import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { KcField, KcPasswordInput, KcSubmit } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginUpdatePassword(
  props: PageProps<
    Extract<KcContext, { pageId: "login-update-password.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { msg, msgStr } = i18n
  const { url, messagesPerField, isAppInitiatedAction } = kcContext

  const hasAnyError = messagesPerField.existsError(
    "password",
    "password-confirm"
  )
  const passwordError = messagesPerField.existsError("password")
    ? messagesPerField.get("password")
    : undefined
  const passwordConfirmError = messagesPerField.existsError("password-confirm")
    ? messagesPerField.get("password-confirm")
    : undefined

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!hasAnyError}
      headerNode={msg("updatePasswordTitle")}
    >
      <form
        id="kc-passwd-update-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <KcField
          id="password-new"
          label={msg("passwordNew")}
          error={passwordError}
        >
          <KcPasswordInput
            id="password-new"
            name="password-new"
            autoFocus
            autoComplete="new-password"
            invalid={hasAnyError}
            showLabel={msgStr("showPassword")}
            hideLabel={msgStr("hidePassword")}
          />
        </KcField>

        <KcField
          id="password-confirm"
          label={msg("passwordConfirm")}
          error={passwordConfirmError}
        >
          <KcPasswordInput
            id="password-confirm"
            name="password-confirm"
            autoComplete="new-password"
            invalid={hasAnyError}
            showLabel={msgStr("showPassword")}
            hideLabel={msgStr("hidePassword")}
          />
        </KcField>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            id="logout-sessions"
            name="logout-sessions"
            value="on"
            defaultChecked
          />
          {msg("logoutOtherSessions")}
        </label>

        {isAppInitiatedAction ? (
          <div className="grid grid-cols-2 gap-2">
            <KcSubmit label={msgStr("doSubmit")} />
            <Button
              size="lg"
              type="submit"
              variant="outline"
              name="cancel-aia"
              value="true"
            >
              {msg("doCancel")}
            </Button>
          </div>
        ) : (
          <KcSubmit label={msgStr("doSubmit")} />
        )}
      </form>
    </Template>
  )
}
