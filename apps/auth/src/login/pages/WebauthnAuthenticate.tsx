import { Button } from "@metronome/ui/components/button"
import { Link } from "@metronome/ui/components/link"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript"
import { Fragment } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function WebauthnAuthenticate(
  props: PageProps<
    Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const {
    url,
    realm,
    registrationDisabled,
    authenticators,
    shouldDisplayAuthenticators,
  } = kcContext
  const { msg, msgStr, advancedMsg } = i18n

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
      displayInfo={realm.registrationAllowed && !registrationDisabled}
      infoNode={
        <span>
          {msg("noAccount")}{" "}
          <Link tabIndex={6} href={url.registrationUrl}>
            {msg("doRegister")}
          </Link>
        </span>
      }
      headerNode={msg("webauthn-login-title")}
    >
      <div id="kc-form-webauthn" className="space-y-4">
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

        {authenticators && (
          <>
            <form id="authn_select">
              {authenticators.authenticators.map((authenticator, i) => (
                <input
                  key={i}
                  type="hidden"
                  name="authn_use_chk"
                  value={authenticator.credentialId}
                />
              ))}
            </form>

            {shouldDisplayAuthenticators && (
              <div className="space-y-2">
                {authenticators.authenticators.length > 1 && (
                  <p className="font-medium text-sm">
                    {msg("webauthn-available-authenticators")}
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
                        {authenticator.transports.displayNameProperties
                          ?.length ? (
                          <div
                            id={`kc-webauthn-authenticator-transport-${i}`}
                            className="text-muted-foreground text-sm"
                          >
                            {authenticator.transports.displayNameProperties
                              .map((displayNameProperty, idx, arr) => ({
                                displayNameProperty,
                                hasNext: idx !== arr.length - 1,
                              }))
                              .map(({ displayNameProperty, hasNext }) => (
                                <Fragment key={displayNameProperty}>
                                  {advancedMsg(displayNameProperty)}
                                  {hasNext && <span>, </span>}
                                </Fragment>
                              ))}
                          </div>
                        ) : null}
                        <div className="text-muted-foreground text-sm">
                          <span
                            id={`kc-webauthn-authenticator-createdlabel-${i}`}
                          >
                            {msg("webauthn-createdAt-label")}
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

        <Button
          size="xl"
          id={authButtonId}
          type="button"
          autoFocus
          className="w-full"
        >
          {msgStr("webauthn-doAuthenticate")}
        </Button>
      </div>
    </Template>
  )
}
