import { Alert, AlertDescription } from "@metronome/ui/components/alert"
import { Button } from "@metronome/ui/components/button"
import { Warning } from "@phosphor-icons/react"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { KcSubmit } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function DeleteAccountConfirm(
  props: PageProps<
    Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, triggered_from_aia } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("deleteAccountConfirm")}
    >
      <form action={url.loginAction} method="post" className="space-y-4">
        <Alert
          variant="default"
          className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100"
        >
          <Warning className="size-4" aria-hidden />
          <AlertDescription>{msg("irreversibleAction")}</AlertDescription>
        </Alert>

        <p className="text-sm">{msg("deletingImplies")}</p>
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
          <li>{msg("loggingOutImmediately")}</li>
          <li>{msg("errasingData")}</li>
        </ul>
        <p className="text-sm">{msg("finalDeletionConfirmation")}</p>

        {triggered_from_aia ? (
          <div className="grid grid-cols-2 gap-2">
            <KcSubmit label={msgStr("doConfirmDelete")} />
            <Button
              size="lg"
              type="submit"
              variant="outline"
              name="cancel-aia"
              value="true"
            >
              {msgStr("doCancel")}
            </Button>
          </div>
        ) : (
          <KcSubmit label={msgStr("doConfirmDelete")} />
        )}
      </form>
    </Template>
  )
}
