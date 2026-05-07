import { Button } from "@metronome/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function WebauthnError(
  props: PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, isAppInitiatedAction } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage
      headerNode={msg("webauthn-error-title")}
    >
      <form
        id="kc-error-credential-form"
        action={url.loginAction}
        method="POST"
      >
        <input
          type="hidden"
          id="executionValue"
          name="authenticationExecution"
        />
        <input type="hidden" id="isSetRetry" name="isSetRetry" />
      </form>

      <div className="space-y-2">
        <Button
          tabIndex={4}
          type="button"
          name="try-again"
          id="kc-try-again"
          className="w-full"
          onClick={() => {
            // @ts-ignore: Trusted Keycloak's code
            document.getElementById("isSetRetry").value = "retry"
            // @ts-ignore: Trusted Keycloak's code
            document.getElementById("executionValue").value = "${execution}"
            ;(
              document.getElementById(
                "kc-error-credential-form"
              ) as HTMLFormElement | null
            )?.requestSubmit()
          }}
        >
          {msgStr("doTryAgain")}
        </Button>

        {isAppInitiatedAction && (
          <form
            action={url.loginAction}
            id="kc-webauthn-settings-form"
            method="POST"
          >
            <Button
              type="submit"
              variant="outline"
              id="cancelWebAuthnAIA"
              name="cancel-aia"
              value="true"
              className="w-full"
            >
              {msgStr("doCancel")}
            </Button>
          </form>
        )}
      </div>
    </Template>
  )
}
