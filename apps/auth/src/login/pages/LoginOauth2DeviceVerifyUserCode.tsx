import type { PageProps } from "keycloakify/login/pages/PageProps"
import { KcField, KcSubmit, KcTextInput } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginOauth2DeviceVerifyUserCode(
  props: PageProps<
    Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, classes, Template } = props
  const { url } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("oauth2DeviceVerificationTitle")}
    >
      <form
        id="kc-user-verify-device-user-code-form"
        action={url.oauth2DeviceVerificationAction}
        method="post"
        className="space-y-4"
      >
        <KcField
          id="device-user-code"
          label={msg("verifyOAuth2DeviceUserCode")}
        >
          <KcTextInput
            id="device-user-code"
            name="device_user_code"
            autoComplete="off"
            type="text"
            autoFocus
          />
        </KcField>

        <KcSubmit name="submit" label={msgStr("doSubmit")} />
      </form>
    </Template>
  )
}
