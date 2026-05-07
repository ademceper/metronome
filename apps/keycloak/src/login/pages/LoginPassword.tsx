import { Button } from "@metronome/ui/components/button"
import { useScript } from "keycloakify/login/pages/LoginPassword.useScript"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useState } from "react"
import { AnimatedLink } from "../components/animated-link"
import { KcField, KcPasswordInput, KcSubmit } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginPassword(
  props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const {
    realm,
    url,
    messagesPerField,
    enableWebAuthnConditionalUI,
    authenticators,
  } = kcContext
  const { msg, msgStr } = i18n

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false)
  const webAuthnButtonId = "authenticateWebAuthnButton"

  useScript({ webAuthnButtonId, kcContext, i18n })

  const hasPasswordError = messagesPerField.existsError("password")
  const passwordErrorMessage = hasPasswordError
    ? messagesPerField.get("password")
    : undefined

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("doLogIn")}
      displayMessage={!hasPasswordError}
    >
      <form
        id="kc-form-login"
        onSubmit={() => {
          setIsLoginButtonDisabled(true)
          return true
        }}
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <KcField
          id="password"
          label={msg("password")}
          error={passwordErrorMessage}
        >
          <KcPasswordInput
            tabIndex={2}
            id="password"
            name="password"
            autoFocus
            autoComplete="on"
            invalid={messagesPerField.existsError("username", "password")}
            showLabel={msgStr("showPassword")}
            hideLabel={msgStr("hidePassword")}
          />
        </KcField>

        {realm.resetPasswordAllowed && (
          <div className="flex justify-end">
            <AnimatedLink
              tabIndex={5}
              href={url.loginResetCredentialsUrl}
              className="text-sm"
            >
              {msg("doForgotPassword")}
            </AnimatedLink>
          </div>
        )}

        <KcSubmit
          tabIndex={4}
          name="login"
          id="kc-login"
          disabled={isLoginButtonDisabled}
          label={msgStr("doLogIn")}
        />
      </form>

      {enableWebAuthnConditionalUI && (
        <div className="space-y-3">
          <form id="webauth" action={url.loginAction} method="post">
            <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
            <input
              type="hidden"
              id="authenticatorData"
              name="authenticatorData"
            />
            <input type="hidden" id="signature" name="signature" />
            <input type="hidden" id="credentialId" name="credentialId" />
            <input type="hidden" id="userHandle" name="userHandle" />
            <input type="hidden" id="error" name="error" />
          </form>

          {authenticators !== undefined &&
            authenticators.authenticators.length !== 0 && (
              <form id="authn_select">
                {authenticators.authenticators.map((authenticator, i) => (
                  <input
                    key={i}
                    type="hidden"
                    name="authn_use_chk"
                    readOnly
                    value={authenticator.credentialId}
                  />
                ))}
              </form>
            )}

          <Button
            size="xl"
            id={webAuthnButtonId}
            type="button"
            variant="outline"
            className="w-full"
          >
            {msgStr("passkey-doAuthenticate")}
          </Button>
        </div>
      )}
    </Template>
  )
}
