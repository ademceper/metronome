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
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import { useScript } from "keycloakify/login/pages/Login.useScript"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { SocialProviderIcon } from "../components/social-provider-icon"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import { type LoginFormValues, loginSchema } from "../schemas/login"

export default function Login(
  props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    auth,
    registrationDisabled,
    messagesPerField,
    enableWebAuthnConditionalUI,
    authenticators,
  } = kcContext
  const { msg, msgStr } = i18n

  const formRef = useRef<HTMLFormElement>(null)
  const webAuthnButtonId = "authenticateWebAuthnButton"

  useScript({ webAuthnButtonId, kcContext, i18n })

  const credentialError = messagesPerField.existsError("username", "password")
    ? messagesPerField.getFirstError("username", "password")
    : undefined

  const usernameLabel = !realm.loginWithEmailAllowed
    ? msgStr("username")
    : !realm.registrationEmailAsUsername
      ? msgStr("usernameOrEmail")
      : msgStr("email")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema(msgStr)),
    defaultValues: {
      username: login.username ?? "",
      password: "",
      rememberMe: !!login.rememberMe,
    },
    errors: credentialError
      ? usernameHidden
        ? { password: { type: "server", message: credentialError } }
        : { username: { type: "server", message: credentialError } }
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
      displayMessage={!credentialError}
      headerNode={msg("loginAccountTitle")}
      displayInfo={
        realm.password && realm.registrationAllowed && !registrationDisabled
      }
      infoNode={
        <span>
          {msg("noAccount")}{" "}
          <Link tabIndex={8} href={url.registrationUrl}>
            {msg("doRegister")}
          </Link>
        </span>
      }
      socialProvidersNode={
        realm.password && social?.providers && social.providers.length !== 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground text-xs uppercase">
                {msg("identity-provider-login-label")}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <ul className="flex flex-col gap-2">
              {social.providers.map((p) => (
                <li key={p.alias}>
                  <Button
                    size="xl"
                    asChild
                    variant="outline"
                    className="relative w-full justify-center text-sm"
                  >
                    <a id={`social-${p.alias}`} href={p.loginUrl}>
                      <SocialProviderIcon
                        alias={p.alias}
                        iconClasses={p.iconClasses}
                        className="absolute left-4 size-5"
                      />
                      <span>
                        {msgStr("loginSocialWith", kcSanitize(p.displayName))}
                      </span>
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      }
    >
      {realm.password && (
        <Form {...form}>
          <form
            ref={formRef}
            id="kc-form-login"
            action={url.loginAction}
            method="post"
            className="space-y-2"
            onSubmit={form.handleSubmit(onValid)}
          >
            {!usernameHidden && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        variant="floating"
                        label={usernameLabel}
                        tabIndex={2}
                        id="username"
                        type="text"
                        autoFocus
                        autoComplete={
                          enableWebAuthnConditionalUI
                            ? "username webauthn"
                            : "username"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                      tabIndex={3}
                      id="password"
                      autoComplete="current-password"
                      showLabel={msgStr("showPassword")}
                      hideLabel={msgStr("hidePassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-2">
              {realm.rememberMe && !usernameHidden ? (
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          tabIndex={5}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm">
                        {msg("rememberMe")}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ) : (
                <span />
              )}
              {realm.resetPasswordAllowed && (
                <Link
                  tabIndex={6}
                  href={url.loginResetCredentialsUrl}
                  className="text-sm"
                >
                  {msg("doForgotPassword")}
                </Link>
              )}
            </div>

            <input
              type="hidden"
              id="id-hidden-input"
              name="credentialId"
              value={auth.selectedCredential}
            />
            <Button
              type="submit"
              size="xl"
              tabIndex={7}
              name="login"
              id="kc-login"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {msgStr("doLogIn")}
            </Button>
          </form>
        </Form>
      )}

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
