import type { PageProps } from "keycloakify/login/pages/PageProps"
import { KcField, KcSubmit, KcTextInput } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginRecoveryAuthnCodeInput(
  props: PageProps<
    Extract<KcContext, { pageId: "login-recovery-authn-code-input.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext
  const { msg, msgStr } = i18n

  const hasError = messagesPerField.existsError("recoveryCodeInput")
  const errorMessage = hasError
    ? messagesPerField.get("recoveryCodeInput")
    : undefined

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("auth-recovery-code-header")}
      displayMessage={!hasError}
    >
      <form
        id="kc-recovery-code-login-form"
        action={url.loginAction}
        method="POST"
        className="space-y-4"
      >
        <KcField
          id="recoveryCodeInput"
          label={msg(
            "auth-recovery-code-prompt",
            `${recoveryAuthnCodesInputBean.codeNumber}`
          )}
          error={errorMessage}
        >
          <KcTextInput
            tabIndex={1}
            id="recoveryCodeInput"
            name="recoveryCodeInput"
            type="text"
            autoComplete="one-time-code"
            autoFocus
            invalid={hasError}
          />
        </KcField>

        <KcSubmit name="login" id="kc-login" label={msgStr("doLogIn")} />
      </form>
    </Template>
  )
}
