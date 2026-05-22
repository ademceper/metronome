import { Button } from "@metronome/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LinkIdpAction(
  props: PageProps<Extract<KcContext, { pageId: "link-idp-action.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { idpDisplayName, url } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("linkIdpActionTitle", idpDisplayName)}
      displayMessage={false}
    >
      <div id="kc-link-text" className="text-sm">
        {msg("linkIdpActionMessage", idpDisplayName)}
      </div>
      <form action={url.loginAction} method="post" className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="submit"
            size="xl"
            name="continue"
            id="kc-continue"
            className="w-full"
          >
            {msgStr("doContinue")}
          </Button>
          <Button
            size="xl"
            type="submit"
            variant="outline"
            name="cancel-aia"
            id="kc-cancel"
          >
            {msgStr("doCancel")}
          </Button>
        </div>
      </form>
    </Template>
  )
}
