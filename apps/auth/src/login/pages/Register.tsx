import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@metronome/ui/components/form"
import { Input } from "@metronome/ui/components/input"
import { Label } from "@metronome/ui/components/label"
import { Link } from "@metronome/ui/components/link"
import { PasswordInput } from "@metronome/ui/components/password-input"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useLayoutEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import { type RegisterFormValues, registerSchema } from "../schemas/register"

type RegisterProps = PageProps<
  Extract<KcContext, { pageId: "register.ftl" }>,
  I18n
> & {
  doMakeUserConfirmPassword: boolean
}

export default function Register(props: RegisterProps) {
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    doMakeUserConfirmPassword,
  } = props

  const {
    messageHeader,
    url,
    messagesPerField,
    realm,
    profile,
    passwordRequired,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired,
  } = kcContext

  const { msg, msgStr, advancedMsg } = i18n

  const formRef = useRef<HTMLFormElement>(null)
  const [areTermsAccepted, setAreTermsAccepted] = useState(false)

  useLayoutEffect(() => {
    ;(window as any).onSubmitRecaptcha = () => {
      formRef.current?.requestSubmit()
    }
    return () => {
      delete (window as any).onSubmitRecaptcha
    }
  }, [])

  const attrs = profile.attributesByName
  const showUsername = !realm.registrationEmailAsUsername
  const usernameAttr = attrs.username
  const emailAttr = attrs.email
  const firstNameAttr = attrs.firstName
  const lastNameAttr = attrs.lastName

  const serverErrors: Partial<Record<keyof RegisterFormValues, string>> = {}
  for (const name of [
    "username",
    "email",
    "firstName",
    "lastName",
    "password",
    "password-confirm",
  ] as const) {
    if (messagesPerField.existsError(name)) {
      const message = messagesPerField.get(name)
      if (message) serverErrors[name] = message
    }
  }

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(
      registerSchema(msgStr, {
        showUsername,
        passwordRequired,
        doMakeUserConfirmPassword,
      })
    ),
    defaultValues: {
      username: usernameAttr?.value ?? "",
      email: emailAttr?.value ?? "",
      firstName: firstNameAttr?.value ?? "",
      lastName: lastNameAttr?.value ?? "",
      password: "",
      "password-confirm": "",
    },
    errors: Object.fromEntries(
      Object.entries(serverErrors).map(([key, message]) => [
        key,
        { type: "server", message },
      ])
    ) as never,
  })

  const onValid = () => {
    formRef.current?.submit()
  }

  const isSubmitDisabled =
    form.formState.isSubmitting ||
    (termsAcceptanceRequired && !areTermsAccepted)

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={
        messageHeader !== undefined
          ? advancedMsg(messageHeader)
          : msg("registerTitle")
      }
      displayMessage={messagesPerField.exists("global")}
    >
      <Form {...form}>
        <form
          ref={formRef}
          id="kc-register-form"
          action={url.registrationAction}
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onValid)}
        >
          {showUsername && usernameAttr && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      variant="floating"
                      label={
                        <>
                          {msg("username")}
                          {usernameAttr.required && (
                            <span className="ml-0.5 text-destructive">*</span>
                          )}
                        </>
                      }
                      id="username"
                      type="text"
                      autoComplete="username"
                      disabled={usernameAttr.readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {firstNameAttr && (
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      variant="floating"
                      label={
                        <>
                          {msg("firstName")}
                          {firstNameAttr.required && (
                            <span className="ml-0.5 text-destructive">*</span>
                          )}
                        </>
                      }
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      disabled={firstNameAttr.readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {lastNameAttr && (
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      variant="floating"
                      label={
                        <>
                          {msg("lastName")}
                          {lastNameAttr.required && (
                            <span className="ml-0.5 text-destructive">*</span>
                          )}
                        </>
                      }
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      disabled={lastNameAttr.readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {emailAttr && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      variant="floating"
                      label={
                        <>
                          {msg("email")}
                          {emailAttr.required && (
                            <span className="ml-0.5 text-destructive">*</span>
                          )}
                        </>
                      }
                      id="email"
                      type="email"
                      autoComplete="email"
                      disabled={emailAttr.readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {passwordRequired && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        variant="floating"
                        label={
                          <>
                            {msg("password")}
                            <span className="ml-0.5 text-destructive">*</span>
                          </>
                        }
                        id="password"
                        autoComplete="new-password"
                        showLabel={msgStr("showPassword")}
                        hideLabel={msgStr("hidePassword")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {doMakeUserConfirmPassword && (
                <FormField
                  control={form.control}
                  name="password-confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          variant="floating"
                          label={
                            <>
                              {msg("passwordConfirm")}
                              <span className="ml-0.5 text-destructive">*</span>
                            </>
                          }
                          id="password-confirm"
                          autoComplete="new-password"
                          showLabel={msgStr("showPassword")}
                          hideLabel={msgStr("hidePassword")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}

          {termsAcceptanceRequired && (
            <div className="space-y-2">
              <div>
                <p className="font-medium text-sm">{msg("termsTitle")}</p>
                <div
                  id="kc-registration-terms-text"
                  className="text-muted-foreground text-sm"
                >
                  {msg("termsText")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={areTermsAccepted}
                  onCheckedChange={(checked) =>
                    setAreTermsAccepted(checked === true)
                  }
                  aria-invalid={messagesPerField.existsError("termsAccepted")}
                />
                <Label htmlFor="termsAccepted">{msg("acceptTerms")}</Label>
              </div>
              {messagesPerField.existsError("termsAccepted") && (
                <p
                  id="input-error-terms-accepted"
                  className="text-destructive text-sm"
                  aria-live="polite"
                  dangerouslySetInnerHTML={{
                    __html: kcSanitize(messagesPerField.get("termsAccepted")),
                  }}
                />
              )}
            </div>
          )}

          {recaptchaRequired &&
            (recaptchaVisible || recaptchaAction === undefined) && (
              <div
                className="g-recaptcha"
                data-size="compact"
                data-sitekey={recaptchaSiteKey}
                data-action={recaptchaAction}
              />
            )}

          {recaptchaRequired &&
          !recaptchaVisible &&
          recaptchaAction !== undefined ? (
            <Button
              size="xl"
              type="submit"
              className="g-recaptcha w-full"
              data-sitekey={recaptchaSiteKey}
              data-callback="onSubmitRecaptcha"
              data-action={recaptchaAction}
            >
              {msg("doRegister")}
            </Button>
          ) : (
            <Button
              type="submit"
              size="xl"
              className="w-full"
              disabled={isSubmitDisabled}
            >
              {msgStr("doRegister")}
            </Button>
          )}

          <div className="flex justify-center">
            <Link href={url.loginUrl}>{msg("backToLogin")}</Link>
          </div>
        </form>
      </Form>
    </Template>
  )
}
