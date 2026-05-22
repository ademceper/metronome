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
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import {
  type LoginRecoveryAuthnCodeInputFormValues,
  loginRecoveryAuthnCodeInputSchema,
} from "../schemas/login-recovery-authn-code-input"

export default function LoginRecoveryAuthnCodeInput(
  props: PageProps<
    Extract<KcContext, { pageId: "login-recovery-authn-code-input.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, messagesPerField, recoveryAuthnCodesInputBean } = kcContext
  const { msg, msgStr } = i18n

  const formRef = useRef<HTMLFormElement>(null)

  const serverError = messagesPerField.existsError("recoveryCodeInput")
    ? messagesPerField.get("recoveryCodeInput")
    : undefined

  const form = useForm<LoginRecoveryAuthnCodeInputFormValues>({
    resolver: zodResolver(loginRecoveryAuthnCodeInputSchema()),
    defaultValues: { recoveryCodeInput: "" },
    errors: serverError
      ? { recoveryCodeInput: { type: "server", message: serverError } }
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
      headerNode={msg("auth-recovery-code-header")}
      displayMessage={!serverError}
    >
      <Form {...form}>
        <form
          ref={formRef}
          id="kc-recovery-code-login-form"
          action={url.loginAction}
          method="POST"
          className="space-y-2"
          onSubmit={form.handleSubmit(onValid)}
        >
          <FormField
            control={form.control}
            name="recoveryCodeInput"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    variant="floating"
                    label={msgStr(
                      "auth-recovery-code-prompt",
                      `${recoveryAuthnCodesInputBean.codeNumber}`
                    )}
                    tabIndex={1}
                    id="recoveryCodeInput"
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
