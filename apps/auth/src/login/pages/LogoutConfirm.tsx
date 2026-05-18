import { Link } from "@metronome/ui/components/link"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { KcSubmit } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LogoutConfirm(
  props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, client, logoutConfirm } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("logoutConfirmTitle")}
    >
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          {msg("logoutConfirmHeader")}
        </p>
        <form
          action={url.logoutConfirmAction}
          method="POST"
          className="space-y-3"
        >
          <input type="hidden" name="session_code" value={logoutConfirm.code} />
          <KcSubmit
            tabIndex={4}
            name="confirmLogout"
            id="kc-logout"
            label={msgStr("doLogout")}
          />
        </form>
        {!logoutConfirm.skipLink && client.baseUrl && (
          <div className="flex justify-center">
            <Link href={client.baseUrl}>{msg("backToApplication")}</Link>
          </div>
        )}
      </div>
    </Template>
  )
}
