import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useScript } from "keycloakify/login/pages/WebauthnRegister.useScript"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function WebauthnRegister(
  props: PageProps<
    Extract<KcContext, { pageId: "webauthn-register.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, isSetRetry, isAppInitiatedAction } = kcContext
  const { msg, msgStr } = i18n

  const authButtonId = "authenticateWebAuthnButton"

  useScript({
    authButtonId,
    kcContext,
    i18n,
  })

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("webauthn-registration-title")}
    >
      <form
        id="register"
        action={url.loginAction}
        method="POST"
        className="space-y-4"
      >
        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
        <input type="hidden" id="attestationObject" name="attestationObject" />
        <input
          type="hidden"
          id="publicKeyCredentialId"
          name="publicKeyCredentialId"
        />
        <input
          type="hidden"
          id="authenticatorLabel"
          name="authenticatorLabel"
        />
        <input type="hidden" id="transports" name="transports" />
        <input type="hidden" id="error" name="error" />

        <LogoutOtherSessions i18n={i18n} />
      </form>

      <div className="space-y-2">
        <Button size="xl" type="submit" id={authButtonId} className="w-full">
          {msgStr("doRegisterSecurityKey")}
        </Button>

        {!isSetRetry && isAppInitiatedAction && (
          <form
            action={url.loginAction}
            id="kc-webauthn-settings-form"
            method="POST"
          >
            <Button
              size="xl"
              type="submit"
              variant="outline"
              id="cancelWebAuthnAIA"
              name="cancel-aia"
              value="true"
              className="w-full"
            >
              {msg("doCancel")}
            </Button>
          </form>
        )}
      </div>
    </Template>
  )
}

function LogoutOtherSessions(props: { i18n: I18n }) {
  const { i18n } = props
  const { msg } = i18n

  return (
    <div id="kc-form-options">
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          id="logout-sessions"
          name="logout-sessions"
          value="on"
          defaultChecked
        />
        {msg("logoutOtherSessions")}
      </label>
    </div>
  )
}
