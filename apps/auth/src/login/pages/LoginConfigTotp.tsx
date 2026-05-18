import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import { Link } from "@metronome/ui/components/link"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { KcField, KcSubmit, KcTextInput } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginConfigTotp(
  props: PageProps<
    Extract<KcContext, { pageId: "login-config-totp.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext
  const { msg, msgStr, advancedMsg } = i18n

  const totpError = messagesPerField.existsError("totp")
  const userLabelError = messagesPerField.existsError("userLabel")

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("loginTotpTitle")}
      displayMessage={!messagesPerField.existsError("totp", "userLabel")}
    >
      <ol id="kc-totp-settings" className="list-decimal space-y-4 pl-5 text-sm">
        <li>
          <p>{msg("loginTotpStep1")}</p>
          <ul
            id="kc-totp-supported-apps"
            className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground"
          >
            {totp.supportedApplications.map((app) => (
              <li key={app}>{advancedMsg(app)}</li>
            ))}
          </ul>
        </li>

        {mode === "manual" ? (
          <>
            <li>
              <p>{msg("loginTotpManualStep2")}</p>
              <p className="mt-2">
                <span
                  id="kc-totp-secret-key"
                  className="break-all rounded bg-muted px-2 py-1 font-mono text-xs"
                >
                  {totp.totpSecretEncoded}
                </span>
              </p>
              <p className="mt-2">
                <Link href={totp.qrUrl} id="mode-barcode">
                  {msg("loginTotpScanBarcode")}
                </Link>
              </p>
            </li>
            <li>
              <p>{msg("loginTotpManualStep3")}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                <li id="kc-totp-type">
                  {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                </li>
                <li id="kc-totp-algorithm">
                  {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                </li>
                <li id="kc-totp-digits">
                  {msg("loginTotpDigits")}: {totp.policy.digits}
                </li>
                {totp.policy.type === "totp" ? (
                  <li id="kc-totp-period">
                    {msg("loginTotpInterval")}: {totp.policy.period}
                  </li>
                ) : (
                  <li id="kc-totp-counter">
                    {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                  </li>
                )}
              </ul>
            </li>
          </>
        ) : (
          <li>
            <p>{msg("loginTotpStep2")}</p>
            <img
              id="kc-totp-secret-qr-code"
              src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
              alt="Figure: Barcode"
              className="my-2"
            />
            <p>
              <Link href={totp.manualUrl} id="mode-manual">
                {msg("loginTotpUnableToScan")}
              </Link>
            </p>
          </li>
        )}
        <li>
          <p>{msg("loginTotpStep3")}</p>
          <p className="text-muted-foreground">
            {msg("loginTotpStep3DeviceName")}
          </p>
        </li>
      </ol>

      <form
        action={url.loginAction}
        id="kc-totp-settings-form"
        method="post"
        className="mt-6 space-y-4"
      >
        <KcField
          id="totp"
          label={msg("authenticatorCode")}
          required
          error={
            totpError ? kcSanitize(messagesPerField.get("totp")) : undefined
          }
        >
          <KcTextInput
            type="text"
            id="totp"
            name="totp"
            autoComplete="off"
            invalid={totpError}
          />
        </KcField>

        <KcField
          id="userLabel"
          label={msg("loginTotpDeviceName")}
          required={totp.otpCredentials.length >= 1}
          error={
            userLabelError
              ? kcSanitize(messagesPerField.get("userLabel"))
              : undefined
          }
        >
          <KcTextInput
            type="text"
            id="userLabel"
            name="userLabel"
            autoComplete="off"
            invalid={userLabelError}
          />
        </KcField>

        <input
          type="hidden"
          id="totpSecret"
          name="totpSecret"
          value={totp.totpSecret}
        />
        {mode && <input type="hidden" id="mode" value={mode} />}

        <LogoutOtherSessions i18n={i18n} />

        {isAppInitiatedAction ? (
          <div className="grid grid-cols-2 gap-2">
            <KcSubmit id="saveTOTPBtn" label={msgStr("doSubmit")} />
            <Button
              size="xl"
              type="submit"
              variant="outline"
              id="cancelTOTPBtn"
              name="cancel-aia"
              value="true"
            >
              {msg("doCancel")}
            </Button>
          </div>
        ) : (
          <KcSubmit id="saveTOTPBtn" label={msgStr("doSubmit")} />
        )}
      </form>
    </Template>
  )
}

function LogoutOtherSessions(props: { i18n: I18n }) {
  const { i18n } = props
  const { msg } = i18n

  return (
    <div id="kc-form-options">
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          id="logout-sessions"
          name="logout-sessions"
          value="on"
          defaultChecked
        />
        {msg("logoutOtherSessions")}
      </label>
    </div>
  )
}
