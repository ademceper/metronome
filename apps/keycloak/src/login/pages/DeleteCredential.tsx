import { Button } from "@metronome/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { KcSubmit } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function DeleteCredential(
  props: PageProps<
    Extract<KcContext, { pageId: "delete-credential.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { msgStr, msg } = i18n
  const { url, credentialLabel } = kcContext

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg("deleteCredentialTitle", credentialLabel)}
    >
      <div id="kc-delete-text" className="text-sm">
        {msg("deleteCredentialMessage", credentialLabel)}
      </div>
      <form action={url.loginAction} method="POST" className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <KcSubmit
            name="accept"
            id="kc-accept"
            label={msgStr("doConfirmDelete")}
          />
          <Button
            type="submit"
            variant="outline"
            name="cancel-aia"
            value={msgStr("doCancel")}
            id="kc-decline"
          >
            {msgStr("doCancel")}
          </Button>
        </div>
      </form>
    </Template>
  )
}
