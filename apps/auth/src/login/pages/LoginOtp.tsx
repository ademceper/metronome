import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@metronome/ui/components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@metronome/ui/components/form"
import { Input } from "@metronome/ui/components/input"
import { Label } from "@metronome/ui/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@metronome/ui/components/radio-group"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import { type LoginOtpFormValues, loginOtpSchema } from "../schemas/login-otp"

export default function LoginOtp(
  props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { otpLogin, url, messagesPerField } = kcContext
  const { msg, msgStr } = i18n

  const formRef = useRef<HTMLFormElement>(null)

  const serverError = messagesPerField.existsError("totp")
    ? messagesPerField.get("totp")
    : undefined

  const form = useForm<LoginOtpFormValues>({
    resolver: zodResolver(loginOtpSchema(msgStr)),
    defaultValues: {
      otp: "",
      selectedCredentialId: otpLogin.selectedCredentialId ?? "",
    },
    errors: serverError
      ? { otp: { type: "server", message: serverError } }
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
      displayMessage={!serverError}
      headerNode={msg("doLogIn")}
    >
      <Form {...form}>
        <form
          ref={formRef}
          id="kc-otp-login-form"
          action={url.loginAction}
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onValid)}
        >
          {otpLogin.userOtpCredentials.length > 1 && (
            <FormField
              control={form.control}
              name="selectedCredentialId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      className="space-y-2"
                    >
                      {otpLogin.userOtpCredentials.map((otpCredential, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-md border p-3"
                        >
                          <RadioGroupItem
                            id={`kc-otp-credential-${i}`}
                            value={otpCredential.id}
                          />
                          <Label
                            htmlFor={`kc-otp-credential-${i}`}
                            className="cursor-pointer"
                          >
                            {otpCredential.userLabel}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{msg("loginOtpOneTime")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="otp"
                    type="text"
                    autoComplete="one-time-code"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="xl"
            name="login"
            id="kc-login"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {msgStr("doLogIn")}
          </Button>
        </form>
      </Form>
    </Template>
  )
}
