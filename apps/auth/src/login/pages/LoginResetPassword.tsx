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
import { Link } from "@metronome/ui/components/link"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import {
  type LoginResetPasswordFormValues,
  loginResetPasswordSchema,
} from "../schemas/login-reset-password"

export default function LoginResetPassword(
  props: PageProps<
    Extract<KcContext, { pageId: "login-reset-password.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, realm, auth, messagesPerField } = kcContext
  const { msg, msgStr } = i18n

  const formRef = useRef<HTMLFormElement>(null)

  const serverError = messagesPerField.existsError("username")
    ? messagesPerField.get("username")
    : undefined

  const usernameLabel = !realm.loginWithEmailAllowed
    ? msgStr("username")
    : !realm.registrationEmailAsUsername
      ? msgStr("usernameOrEmail")
      : msgStr("email")

  const form = useForm<LoginResetPasswordFormValues>({
    resolver: zodResolver(loginResetPasswordSchema(msgStr)),
    defaultValues: { username: auth.attemptedUsername ?? "" },
    errors: serverError
      ? { username: { type: "server", message: serverError } }
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
      displayInfo
      displayMessage={!serverError}
      infoNode={
        realm.duplicateEmailsAllowed
          ? msg("emailInstructionUsername")
          : msg("emailInstruction")
      }
      headerNode={msg("emailForgotTitle")}
    >
      <Form {...form}>
        <form
          ref={formRef}
          id="kc-reset-password-form"
          action={url.loginAction}
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onValid)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{usernameLabel}</FormLabel>
                <FormControl>
                  <Input {...field} id="username" type="text" autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="xl"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {msgStr("doSubmit")}
          </Button>

          <div className="text-center text-sm">
            <Link href={url.loginUrl}>{msg("backToLogin")}</Link>
          </div>
        </form>
      </Form>
    </Template>
  )
}
