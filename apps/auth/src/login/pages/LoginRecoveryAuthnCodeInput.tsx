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
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

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

  const schema = z.object({
    recoveryCodeInput: z.string().min(1, "Recovery code is required"),
  })
  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
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
          className="space-y-4"
          onSubmit={form.handleSubmit(onValid)}
        >
          <FormField
            control={form.control}
            name="recoveryCodeInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {msg(
                    "auth-recovery-code-prompt",
                    `${recoveryAuthnCodesInputBean.codeNumber}`
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
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
