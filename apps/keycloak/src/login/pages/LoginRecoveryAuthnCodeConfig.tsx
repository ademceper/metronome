import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@metronome/ui/components/alert"
import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import { Label } from "@metronome/ui/components/label"
import { Copy, DownloadSimple, Printer, Warning } from "@phosphor-icons/react"
import { useScript } from "keycloakify/login/pages/LoginRecoveryAuthnCodeConfig.useScript"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginRecoveryAuthnCodeConfig(
  props: PageProps<
    Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props

  const { recoveryAuthnCodesConfigBean, isAppInitiatedAction } = kcContext

  const { msg, msgStr } = i18n

  const olRecoveryCodesListId = "kc-recovery-codes-list"

  useScript({ olRecoveryCodesListId, i18n })

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("recovery-code-config-header")}
    >
      <Alert
        role="alert"
        aria-label="Warning alert"
        className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100"
      >
        <Warning className="size-4" aria-hidden />
        <AlertTitle>{msg("recovery-code-config-warning-title")}</AlertTitle>
        <AlertDescription>
          {msg("recovery-code-config-warning-message")}
        </AlertDescription>
      </Alert>

      <ol
        id={olRecoveryCodesListId}
        className="grid grid-cols-2 gap-2 rounded-md border bg-muted/30 p-4 font-mono text-sm"
      >
        {recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList.map(
          (code, index) => (
            <li key={index}>
              <span className="text-muted-foreground">{index + 1}:</span>{" "}
              {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
            </li>
          )
        )}
      </ol>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="xl"
          id="printRecoveryCodes"
          type="button"
          variant="link"
          className="h-auto p-0"
        >
          <Printer className="size-4" aria-hidden />
          {msg("recovery-codes-print")}
        </Button>
        <Button
          size="xl"
          id="downloadRecoveryCodes"
          type="button"
          variant="link"
          className="h-auto p-0"
        >
          <DownloadSimple className="size-4" aria-hidden />
          {msg("recovery-codes-download")}
        </Button>
        <Button
          size="xl"
          id="copyRecoveryCodes"
          type="button"
          variant="link"
          className="h-auto p-0"
        >
          <Copy className="size-4" aria-hidden />
          {msg("recovery-codes-copy")}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="kcRecoveryCodesConfirmationCheck"
          name="kcRecoveryCodesConfirmationCheck"
          className="size-4"
          onChange={(event) => {
            //@ts-ignore: This is inherited from the original code
            document.getElementById("saveRecoveryAuthnCodesBtn").disabled =
              !event.target.checked
          }}
        />
        <Label htmlFor="kcRecoveryCodesConfirmationCheck">
          {msg("recovery-codes-confirmation-message")}
        </Label>
      </div>

      <form
        action={kcContext.url.loginAction}
        id="kc-recovery-codes-settings-form"
        method="post"
        className="space-y-3"
      >
        <input
          type="hidden"
          name="generatedRecoveryAuthnCodes"
          value={
            recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString
          }
        />
        <input
          type="hidden"
          name="generatedAt"
          value={recoveryAuthnCodesConfigBean.generatedAt}
        />
        <input
          type="hidden"
          id="userLabel"
          name="userLabel"
          value={msgStr("recovery-codes-label-default")}
        />

        <LogoutOtherSessions i18n={i18n} />

        {isAppInitiatedAction ? (
          <div className="flex flex-col gap-2">
            <Button
              size="xl"
              type="submit"
              id="saveRecoveryAuthnCodesBtn"
              disabled
              className="w-full"
            >
              {msgStr("recovery-codes-action-complete")}
            </Button>
            <Button
              size="xl"
              type="submit"
              variant="outline"
              id="cancelRecoveryAuthnCodesBtn"
              name="cancel-aia"
              value="true"
            >
              {msg("recovery-codes-action-cancel")}
            </Button>
          </div>
        ) : (
          <Button
            size="xl"
            type="submit"
            id="saveRecoveryAuthnCodesBtn"
            disabled
            className="w-full"
          >
            {msgStr("recovery-codes-action-complete")}
          </Button>
        )}
      </form>
    </Template>
  )
}

function LogoutOtherSessions(props: { i18n: I18n }) {
  const { i18n } = props
  const { msg } = i18n

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="logout-sessions"
        name="logout-sessions"
        value="on"
        defaultChecked
      />
      <Label htmlFor="logout-sessions">{msg("logoutOtherSessions")}</Label>
    </div>
  )
}
