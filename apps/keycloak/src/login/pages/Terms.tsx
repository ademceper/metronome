import { Button } from "@metronome/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function Terms(
  props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { msg, msgStr } = i18n
  const { url } = kcContext

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg("termsTitle")}
    >
      <div className="space-y-4">
        <div className="max-h-80 overflow-y-auto rounded-md border bg-muted/30 p-4 text-sm">
          {msg("termsText")}
        </div>
        <form
          action={url.loginAction}
          method="POST"
          className="grid grid-cols-2 gap-2"
        >
          <Button size="xl" type="submit" name="accept" id="kc-accept">
            {msgStr("doAccept")}
          </Button>
          <Button
            size="xl"
            type="submit"
            name="cancel"
            id="kc-decline"
            variant="outline"
          >
            {msgStr("doDecline")}
          </Button>
        </form>
      </div>
    </Template>
  )
}
