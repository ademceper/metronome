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
  type IdpReviewUserProfileFormValues,
  idpReviewUserProfileSchema,
} from "../schemas/idp-review-user-profile"

type IdpReviewUserProfileProps = PageProps<
  Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>,
  I18n
>

export default function IdpReviewUserProfile(props: IdpReviewUserProfileProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { msg, msgStr } = i18n
  const { url, messagesPerField, profile } = kcContext

  const formRef = useRef<HTMLFormElement>(null)

  const attrs = profile.attributesByName
  const usernameAttr = attrs.username
  const emailAttr = attrs.email
  const firstNameAttr = attrs.firstName
  const lastNameAttr = attrs.lastName

  const serverErrors: Partial<
    Record<keyof IdpReviewUserProfileFormValues, string>
  > = {}
  for (const name of ["username", "email", "firstName", "lastName"] as const) {
    if (messagesPerField.existsError(name)) {
      const message = messagesPerField.get(name)
      if (message) serverErrors[name] = message
    }
  }

  const form = useForm<IdpReviewUserProfileFormValues>({
    resolver: zodResolver(idpReviewUserProfileSchema(msgStr)),
    defaultValues: {
      username: usernameAttr?.value ?? "",
      email: emailAttr?.value ?? "",
      firstName: firstNameAttr?.value ?? "",
      lastName: lastNameAttr?.value ?? "",
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

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={messagesPerField.exists("global")}
      headerNode={msg("loginIdpReviewProfileTitle")}
    >
      <Form {...form}>
        <form
          ref={formRef}
          id="kc-idp-review-profile-form"
          action={url.loginAction}
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onValid)}
        >
          {usernameAttr && (
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

          <Button
            type="submit"
            size="xl"
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
