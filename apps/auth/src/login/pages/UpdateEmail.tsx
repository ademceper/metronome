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
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import {
  type UpdateEmailFormValues,
  updateEmailSchema,
} from "../schemas/update-email"

type UpdateEmailProps = PageProps<
  Extract<KcContext, { pageId: "update-email.ftl" }>,
  I18n
>

export default function UpdateEmail(props: UpdateEmailProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { msg, msgStr } = i18n

  const { url, messagesPerField, profile, isAppInitiatedAction } = kcContext

  const formRef = useRef<HTMLFormElement>(null)
  const emailAttr = profile.attributesByName.email

  const serverError = messagesPerField.existsError("email")
    ? messagesPerField.get("email")
    : undefined

  const form = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailSchema(msgStr)),
    defaultValues: { email: emailAttr?.value ?? "" },
    errors: serverError
      ? { email: { type: "server", message: serverError } }
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
      displayMessage={messagesPerField.exists("global")}
      displayRequiredFields
      headerNode={msg("updateEmailTitle")}
    >
      <Form {...form}>
        <form
          ref={formRef}
          id="kc-update-email-form"
          action={url.loginAction}
          method="post"
          className="space-y-2"
          onSubmit={form.handleSubmit(onValid)}
        >
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
                      autoFocus
                      disabled={emailAttr.readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="logout-sessions"
              name="logout-sessions"
              value="on"
              defaultChecked
            />
            <Label htmlFor="logout-sessions">
              {msg("logoutOtherSessions")}
            </Label>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              size="xl"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {msgStr("doSubmit")}
            </Button>
            {isAppInitiatedAction && (
              <Button
                size="xl"
                type="submit"
                variant="outline"
                name="cancel-aia"
                value="true"
              >
                {msg("doCancel")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Template>
  )
}
