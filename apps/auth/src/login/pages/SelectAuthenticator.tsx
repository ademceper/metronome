import { CaretRight } from "@phosphor-icons/react"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function SelectAuthenticator(
  props: PageProps<
    Extract<KcContext, { pageId: "select-authenticator.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, auth } = kcContext
  const { msg, advancedMsg } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayInfo={false}
      headerNode={msg("loginChooseAuthenticator")}
    >
      <form
        id="kc-select-credential-form"
        action={url.loginAction}
        method="POST"
        className="space-y-2"
      >
        {auth.authenticationSelections.map((authenticationSelection, i) => (
          <button
            key={i}
            type="submit"
            name="authenticationExecution"
            value={authenticationSelection.authExecId}
            className="flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent"
          >
            {authenticationSelection.iconCssClass && (
              <div className="flex size-10 shrink-0 items-center justify-center text-muted-foreground">
                <i
                  className={authenticationSelection.iconCssClass}
                  aria-hidden
                />
              </div>
            )}
            <div className="flex-1">
              <div className="font-medium">
                {advancedMsg(authenticationSelection.displayName)}
              </div>
              <div className="text-muted-foreground text-sm">
                {advancedMsg(authenticationSelection.helpText)}
              </div>
            </div>
            <CaretRight
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          </button>
        ))}
      </form>
    </Template>
  )
}
