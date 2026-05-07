import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import { useScript } from "keycloakify/login/pages/LoginUsername.useScript"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useState } from "react"
import { AnimatedLink } from "../components/animated-link"
import { KcField, KcSubmit, KcTextInput } from "../components/kc-form"
import { SocialProviderIcon } from "../components/social-provider-icon"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginUsername(
  props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    registrationDisabled,
    messagesPerField,
    enableWebAuthnConditionalUI,
    authenticators,
  } = kcContext
  const { msg, msgStr } = i18n

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false)
  const webAuthnButtonId = "authenticateWebAuthnButton"

  useScript({ webAuthnButtonId, kcContext, i18n })

  const hasUsernameError = messagesPerField.existsError("username")
  const usernameError = hasUsernameError
    ? messagesPerField.getFirstError("username")
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
      displayMessage={!hasUsernameError}
      displayInfo={
        realm.password && realm.registrationAllowed && !registrationDisabled
      }
      infoNode={
        <span>
          {msg("noAccount")}{" "}
          <AnimatedLink tabIndex={6} href={url.registrationUrl}>
            {msg("doRegister")}
          </AnimatedLink>
        </span>
      }
      headerNode={msg("doLogIn")}
      socialProvidersNode={
        realm.password && social?.providers && social.providers.length !== 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground text-xs uppercase">
                {msg("identity-provider-login-label")}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <ul className="flex flex-col gap-2">
              {social.providers.map((p) => (
                <li key={p.alias}>
                  <Button
                    size="lg"
                    asChild
                    variant="outline"
                    className="relative w-full justify-center text-sm"
                  >
                    <a id={`social-${p.alias}`} href={p.loginUrl}>
                      <SocialProviderIcon
                        alias={p.alias}
                        iconClasses={p.iconClasses}
                        className="absolute left-4 size-5"
                      />
                      <span>
                        {msgStr("loginSocialWith", kcSanitize(p.displayName))}
                      </span>
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      }
    >
      {realm.password && (
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
          {!usernameHidden && (
            <KcField id="username" label={usernameLabel} error={usernameError}>
              <KcTextInput
                tabIndex={2}
                id="username"
                name="username"
                defaultValue={login.username ?? ""}
                type="text"
                autoFocus
                autoComplete={
                  enableWebAuthnConditionalUI ? "username webauthn" : "username"
                }
                invalid={hasUsernameError}
              />
            </KcField>
          )}

          {realm.rememberMe && !usernameHidden && (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                tabIndex={3}
                defaultChecked={!!login.rememberMe}
              />
              {msg("rememberMe")}
            </label>
          )}

          <KcSubmit
            tabIndex={4}
            name="login"
            id="kc-login"
            disabled={isLoginButtonDisabled}
            label={msgStr("doLogIn")}
          />
        </form>
      )}

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
            size="lg"
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
