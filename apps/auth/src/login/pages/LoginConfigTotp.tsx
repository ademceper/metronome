import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@metronome/ui/components/form"
import { Input } from "@metronome/ui/components/input"
import { Link } from "@metronome/ui/components/link"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import {
  type LoginConfigTotpFormValues,
  loginConfigTotpSchema,
} from "../schemas/login-config-totp"

export default function LoginConfigTotp(
  props: PageProps<
    Extract<KcContext, { pageId: "login-config-totp.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext
  const { msg, msgStr, advancedMsg } = i18n

  const formRef = useRef<HTMLFormElement>(null)

  const totpError = messagesPerField.existsError("totp")
    ? messagesPerField.get("totp")
    : undefined
  const userLabelError = messagesPerField.existsError("userLabel")
    ? messagesPerField.get("userLabel")
    : undefined

  const userLabelRequired = totp.otpCredentials.length >= 1

  const serverErrors: Partial<
    Record<keyof LoginConfigTotpFormValues, { type: string; message: string }>
  > = {}
  if (totpError) serverErrors.totp = { type: "server", message: totpError }
  if (userLabelError)
    serverErrors.userLabel = { type: "server", message: userLabelError }

  const form = useForm<LoginConfigTotpFormValues>({
    resolver: zodResolver(loginConfigTotpSchema(msgStr, userLabelRequired)),
    defaultValues: { totp: "", userLabel: "", logoutSessions: true },
    errors: Object.keys(serverErrors).length ? serverErrors : undefined,
  })

  const onValid = () => {
    formRef.current?.submit()
  }

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("loginTotpTitle")}
      displayMessage={!totpError && !userLabelError}
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

      <Form {...form}>
        <form
          ref={formRef}
          action={url.loginAction}
          id="kc-totp-settings-form"
          method="post"
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit(onValid)}
        >
          <FormField
            control={form.control}
            name="totp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{msg("authenticatorCode")}</FormLabel>
                <FormControl>
                  <Input {...field} id="totp" type="text" autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{msg("loginTotpDeviceName")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="userLabel"
                    type="text"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <input
            type="hidden"
            id="totpSecret"
            name="totpSecret"
            value={totp.totpSecret}
          />
          {mode && <input type="hidden" id="mode" value={mode} />}

          <FormField
            control={form.control}
            name="logoutSessions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id="logout-sessions"
                    name="logout-sessions"
                    value="on"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer text-sm">
                  {msg("logoutOtherSessions")}
                </FormLabel>
              </FormItem>
            )}
          />

          {isAppInitiatedAction ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="submit"
                size="xl"
                id="saveTOTPBtn"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {msgStr("doSubmit")}
              </Button>
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
            <Button
              type="submit"
              size="xl"
              id="saveTOTPBtn"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {msgStr("doSubmit")}
            </Button>
          )}
        </form>
      </Form>
    </Template>
  )
}
