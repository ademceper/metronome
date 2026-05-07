import { Button } from "@metronome/ui/components/button"
import { Input } from "@metronome/ui/components/input"
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx"
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

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes })

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
      headerNode={
        <>
          <span className={kcClsx("kcWebAuthnKeyIcon")} />
          {msg("webauthn-registration-title")}
        </>
      }
    >
      <form
        id="register"
        className={kcClsx("kcFormClass")}
        action={url.loginAction}
        method="post"
      >
        <div className={kcClsx("kcFormGroupClass")}>
          <Input type="hidden" id="clientDataJSON" name="clientDataJSON" />
          <Input
            type="hidden"
            id="attestationObject"
            name="attestationObject"
          />
          <Input
            type="hidden"
            id="publicKeyCredentialId"
            name="publicKeyCredentialId"
          />
          <Input
            type="hidden"
            id="authenticatorLabel"
            name="authenticatorLabel"
          />
          <Input type="hidden" id="transports" name="transports" />
          <Input type="hidden" id="error" name="error" />
          <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
        </div>
      </form>
      <Input
        type="submit"
        className={kcClsx(
          "kcButtonClass",
          "kcButtonPrimaryClass",
          "kcButtonBlockClass",
          "kcButtonLargeClass"
        )}
        id={authButtonId}
        value={msgStr("doRegisterSecurityKey")}
      />

      {!isSetRetry && isAppInitiatedAction && (
        <form
          action={url.loginAction}
          className={kcClsx("kcFormClass")}
          id="kc-webauthn-settings-form"
          method="post"
        >
          <Button
            type="submit"
            className={kcClsx(
              "kcButtonClass",
              "kcButtonDefaultClass",
              "kcButtonBlockClass",
              "kcButtonLargeClass"
            )}
            id="cancelWebAuthnAIA"
            name="cancel-aia"
            value="true"
          >
            {msg("doCancel")}
          </Button>
        </form>
      )}
    </Template>
  )
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
  const { kcClsx, i18n } = props

  const { msg } = i18n

  return (
    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
      <div className={kcClsx("kcFormOptionsWrapperClass")}>
        <div className="checkbox">
          <label>
            <Input
              type="checkbox"
              id="logout-sessions"
              name="logout-sessions"
              value="on"
              defaultChecked={true}
            />
            {msg("logoutOtherSessions")}
          </label>
        </div>
      </div>
    </div>
  )
}
