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
import { Label } from "@metronome/ui/components/label"
import { PasswordInput } from "@metronome/ui/components/password-input"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginUpdatePassword(
  props: PageProps<
    Extract<KcContext, { pageId: "login-update-password.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { msg, msgStr } = i18n
  const { url, messagesPerField, isAppInitiatedAction } = kcContext

  const formRef = useRef<HTMLFormElement>(null)

  const passwordError = messagesPerField.existsError("password")
    ? messagesPerField.get("password")
    : undefined
  const passwordConfirmError = messagesPerField.existsError("password-confirm")
    ? messagesPerField.get("password-confirm")
    : undefined

  const schema = z
    .object({
      password: z
        .string()
        .min(1, msgStr("missingPasswordMessage") || "Password is required"),
      passwordConfirm: z
        .string()
        .min(1, msgStr("missingPasswordMessage") || "Password is required"),
      logoutSessions: z.boolean().optional(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: msgStr("notMatchPasswordMessage") || "Passwords do not match",
    })
  type FormValues = z.infer<typeof schema>

  const serverErrors: Partial<
    Record<keyof FormValues, { type: string; message: string }>
  > = {}
  if (passwordError)
    serverErrors.password = { type: "server", message: passwordError }
  if (passwordConfirmError)
    serverErrors.passwordConfirm = {
      type: "server",
      message: passwordConfirmError,
    }

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", passwordConfirm: "", logoutSessions: true },
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
      displayMessage={!passwordError && !passwordConfirmError}
      headerNode={msg("updatePasswordTitle")}
    >
      <Form {...form}>
        <form
          ref={formRef}
          id="kc-passwd-update-form"
          action={url.loginAction}
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onValid)}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{msg("passwordNew")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    id="password-new"
                    name="password-new"
                    autoFocus
                    autoComplete="new-password"
                    showLabel={msgStr("showPassword")}
                    hideLabel={msgStr("hidePassword")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{msg("passwordConfirm")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    id="password-confirm"
                    name="password-confirm"
                    autoComplete="new-password"
                    showLabel={msgStr("showPassword")}
                    hideLabel={msgStr("hidePassword")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <Label
                  htmlFor="logout-sessions"
                  className="cursor-pointer text-sm"
                >
                  {msg("logoutOtherSessions")}
                </Label>
              </FormItem>
            )}
          />

          {isAppInitiatedAction ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="submit"
                size="xl"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {msgStr("doSubmit")}
              </Button>
              <Button
                size="xl"
                type="submit"
                variant="outline"
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
