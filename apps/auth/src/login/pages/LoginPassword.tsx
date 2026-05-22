import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@metronome/ui/components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@metronome/ui/components/form"
import { Input } from "@metronome/ui/components/input"
import { Link } from "@metronome/ui/components/link"
import { useScript } from "keycloakify/login/pages/LoginPassword.useScript"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import {
  type LoginPasswordFormValues,
  loginPasswordSchema,
} from "../schemas/login-password"

export default function LoginPassword(
  props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const {
    realm,
    url,
    messagesPerField,
    enableWebAuthnConditionalUI,
    authenticators,
  } = kcContext
  const { msg, msgStr } = i18n

  const formRef = useRef<HTMLFormElement>(null)
  const webAuthnButtonId = "authenticateWebAuthnButton"

  useScript({ webAuthnButtonId, kcContext, i18n })

  const serverError = messagesPerField.existsError("password")
    ? messagesPerField.get("password")
    : undefined

  const form = useForm<LoginPasswordFormValues>({
    resolver: zodResolver(loginPasswordSchema(msgStr)),
    defaultValues: { password: "" },
    errors: serverError
      ? { password: { type: "server", message: serverError } }
      : undefined,
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
      headerNode={msg("doLogIn")}
      displayMessage={!serverError}
    >
      <Form {...form}>
        <form
          ref={formRef}
          id="kc-form-login"
          action={url.loginAction}
          method="post"
          className="space-y-2"
          onSubmit={form.handleSubmit(onValid)}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    variant="floating"
                    label={msgStr("password")}
                    tabIndex={2}
                    id="password"
                    autoFocus
                    autoComplete="on"
                    showLabel={msgStr("showPassword")}
                    hideLabel={msgStr("hidePassword")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {realm.resetPasswordAllowed && (
            <div className="flex justify-end">
              <Link
                tabIndex={5}
                href={url.loginResetCredentialsUrl}
                className="text-sm"
              >
                {msg("doForgotPassword")}
              </Link>
            </div>
          )}

          <Button
            type="submit"
            size="xl"
            tabIndex={4}
            name="login"
            id="kc-login"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {msgStr("doLogIn")}
          </Button>
        </form>
      </Form>

      {enableWebAuthnConditionalUI && (
        <div className="space-y-2">
          <form id="webauth" action={url.loginAction} method="post">
            <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
            <input
              type="hidden"
              id="authenticatorData"
              name="authenticatorData"
            />
            <input type="hidden" id="signature" name="signature" />
            <input type="hidden" id="credentialId" name="credentialId" />
            <input type="hidden" id="userHandle" name="userHandle" />
            <input type="hidden" id="error" name="error" />
          </form>

          {authenticators !== undefined &&
            authenticators.authenticators.length !== 0 && (
              <form id="authn_select">
                {authenticators.authenticators.map((authenticator, i) => (
                  <input
                    key={i}
                    type="hidden"
                    name="authn_use_chk"
                    readOnly
                    value={authenticator.credentialId}
                  />
                ))}
              </form>
            )}

          <Button
            size="xl"
            id={webAuthnButtonId}
            type="button"
            variant="outline"
            className="w-full"
          >
            {msgStr("passkey-doAuthenticate")}
          </Button>
        </div>
      )}
    </Template>
  )
}
