import { Button } from "@metronome/ui/components/button"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import { useScript } from "keycloakify/login/pages/LoginPasskeysConditionalAuthenticate.useScript"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { Fragment } from "react"
import { AnimatedLink } from "../components/animated-link"
import { KcField, KcTextInput } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginPasskeysConditionalAuthenticate(
  props: PageProps<
    Extract<
      KcContext,
      { pageId: "login-passkeys-conditional-authenticate.ftl" }
    >,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const {
    messagesPerField,
    login,
    url,
    usernameHidden,
    shouldDisplayAuthenticators,
    authenticators,
    registrationDisabled,
    realm,
  } = kcContext
  const { msg, msgStr, advancedMsg } = i18n

  const authButtonId = "authenticateWebAuthnButton"

  useScript({ authButtonId, kcContext, i18n })

  const hasUsernameError = messagesPerField.existsError("username")
  const usernameErrorMessage = hasUsernameError
    ? messagesPerField.get("username")
    : undefined

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("passkey-login-title")}
      infoNode={
        realm.registrationAllowed && !registrationDisabled ? (
          <span>
            {msg("noAccount")}{" "}
            <AnimatedLink tabIndex={6} href={url.registrationUrl}>
              {msg("doRegister")}
            </AnimatedLink>
          </span>
        ) : null
      }
    >
      <div className="space-y-4">
        <form id="webauth" action={url.loginAction} method="POST">
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
          Object.keys(authenticators).length !== 0 && (
            <>
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

              {shouldDisplayAuthenticators && (
                <div className="space-y-2">
                  {authenticators.authenticators.length > 1 && (
                    <p className="font-medium text-sm">
                      {msg("passkey-available-authenticators")}
                    </p>
                  )}
                  <div className="space-y-2">
                    {authenticators.authenticators.map((authenticator, i) => (
                      <div
                        key={i}
                        id={`kc-webauthn-authenticator-item-${i}`}
                        className="flex items-start gap-3 rounded-lg border p-4"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center text-muted-foreground">
                          <i
                            className={authenticator.transports.iconClass}
                            aria-hidden
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div
                            id={`kc-webauthn-authenticator-label-${i}`}
                            className="font-medium"
                          >
                            {advancedMsg(authenticator.label)}
                          </div>
                          {authenticator.transports?.displayNameProperties
                            ?.length ? (
                            <div
                              id={`kc-webauthn-authenticator-transport-${i}`}
                              className="text-muted-foreground text-sm"
                            >
                              {authenticator.transports.displayNameProperties.map(
                                (nameProperty, idx, arr) => (
                                  <Fragment key={idx}>
                                    <span>{advancedMsg(nameProperty)}</span>
                                    {idx !== arr.length - 1 && <span>, </span>}
                                  </Fragment>
                                )
                              )}
                            </div>
                          ) : null}
                          <div className="text-muted-foreground text-sm">
                            <span
                              id={`kc-webauthn-authenticator-createdlabel-${i}`}
                            >
                              {msg("passkey-createdAt-label")}
                            </span>{" "}
                            <span id={`kc-webauthn-authenticator-created-${i}`}>
                              {authenticator.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        <div id="kc-form">
          <div id="kc-form-wrapper">
            {realm.password && (
              <form
                id="kc-form-login"
                action={url.loginAction}
                method="POST"
                style={{ display: "none" }}
                onSubmit={(event) => {
                  try {
                    // @ts-ignore
                    event.target.login.disabled = true
                  } catch {}

                  return true
                }}
              >
                {!usernameHidden && (
                  <KcField
                    id="username"
                    label={msg("passkey-autofill-select")}
                    error={usernameErrorMessage}
                  >
                    <KcTextInput
                      tabIndex={1}
                      id="username"
                      name="username"
                      defaultValue={login.username ?? ""}
                      autoComplete="username webauthn"
                      type="text"
                      autoFocus
                      invalid={hasUsernameError}
                    />
                    {hasUsernameError && usernameErrorMessage && (
                      <p
                        id="input-error-username"
                        className="text-destructive text-sm"
                        aria-live="polite"
                        dangerouslySetInnerHTML={{
                          __html: kcSanitize(usernameErrorMessage),
                        }}
                      />
                    )}
                  </KcField>
                )}
              </form>
            )}
            <div id="kc-form-passkey-button" style={{ display: "none" }}>
              <Button
                size="lg"
                id={authButtonId}
                type="button"
                autoFocus
                className="w-full"
              >
                {msgStr("passkey-doAuthenticate")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Template>
  )
}
