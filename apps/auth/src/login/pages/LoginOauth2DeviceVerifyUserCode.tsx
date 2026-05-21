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
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import {
  type LoginOauth2DeviceVerifyUserCodeFormValues,
  loginOauth2DeviceVerifyUserCodeSchema,
} from "../schemas/login-oauth2-device-verify-user-code"

export default function LoginOauth2DeviceVerifyUserCode(
  props: PageProps<
    Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, classes, Template } = props
  const { url } = kcContext
  const { msg, msgStr } = i18n

  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<LoginOauth2DeviceVerifyUserCodeFormValues>({
    resolver: zodResolver(loginOauth2DeviceVerifyUserCodeSchema()),
    defaultValues: { device_user_code: "" },
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
      headerNode={msg("oauth2DeviceVerificationTitle")}
    >
      <Form {...form}>
        <form
          ref={formRef}
          id="kc-user-verify-device-user-code-form"
          action={url.oauth2DeviceVerificationAction}
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onValid)}
        >
          <FormField
            control={form.control}
            name="device_user_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{msg("verifyOAuth2DeviceUserCode")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="device-user-code"
                    type="text"
                    autoComplete="off"
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
            name="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {msgStr("doSubmit")}
          </Button>
        </form>
      </Form>
    </Template>
  )
}
