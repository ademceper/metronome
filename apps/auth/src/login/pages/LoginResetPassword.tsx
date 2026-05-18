import { AnimatedLink } from "@metronome/ui/components/animated-link"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { KcField, KcSubmit, KcTextInput } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginResetPassword(
  props: PageProps<
    Extract<KcContext, { pageId: "login-reset-password.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, realm, auth, messagesPerField } = kcContext
  const { msg, msgStr } = i18n

  const hasUsernameError = messagesPerField.existsError("username")
  const usernameErrorMessage = hasUsernameError
    ? messagesPerField.get("username")
    : undefined

  const usernameLabel = !realm.loginWithEmailAllowed
    ? msg("username")
    : !realm.registrationEmailAsUsername
      ? msg("usernameOrEmail")
      : msg("email")

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayInfo
      displayMessage={!hasUsernameError}
      infoNode={
        realm.duplicateEmailsAllowed
          ? msg("emailInstructionUsername")
          : msg("emailInstruction")
      }
      headerNode={msg("emailForgotTitle")}
    >
      <form
        id="kc-reset-password-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <KcField
          id="username"
          label={usernameLabel}
          error={usernameErrorMessage}
        >
          <KcTextInput
            type="text"
            id="username"
            name="username"
            autoFocus
            defaultValue={auth.attemptedUsername ?? ""}
            invalid={hasUsernameError}
          />
        </KcField>

        <KcSubmit label={msgStr("doSubmit")} />

        <div className="text-center text-sm">
          <AnimatedLink href={url.loginUrl}>{msg("backToLogin")}</AnimatedLink>
        </div>
      </form>
    </Template>
  )
}
