import { Input } from "@metronome/ui/components/input"
import { getKcClsx } from "keycloakify/login/lib/kcClsx"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LinkIdpAction(
  props: PageProps<Extract<KcContext, { pageId: "link-idp-action.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  })

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
      <div id="kc-link-text" className={kcClsx("kcContentWrapperClass")}>
        {msg("linkIdpActionMessage", idpDisplayName)}
      </div>
      <form
        className={kcClsx("kcFormClass")}
        action={url.loginAction}
        method="post"
      >
        <div className={kcClsx("kcFormGroupClass")}>
          <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
            <Input
              name="continue"
              id="kc-continue"
              type="submit"
              value={msgStr("doContinue")}
            />
            <Input
              name="cancel-aia"
              id="kc-cancel"
              type="submit"
              value={msgStr("doCancel")}
            />
          </div>
        </div>
      </form>
      <div className="clearfix" />
    </Template>
  )
}
