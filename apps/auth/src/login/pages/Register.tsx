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
import { Link } from "@metronome/ui/components/link"
import { cn } from "@metronome/ui/lib/utils"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useLayoutEffect, useRef, useState } from "react"
import type { FieldPath } from "react-hook-form"
import { useForm } from "react-hook-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"
import {
  REGISTER_STEPS,
  type RegisterFormValues,
  registerSchema,
} from "../schemas/register"

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
  } = kcContext

  const { msg, msgStr, advancedMsg } = i18n

  const formRef = useRef<HTMLFormElement>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const step = REGISTER_STEPS[stepIndex]!
  const isLastStep = stepIndex === REGISTER_STEPS.length - 1

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

  const form = useForm<RegisterFormValues>({
    mode: "onTouched",
    resolver: zodResolver(
      registerSchema(msgStr, {
        showUsername,
        passwordRequired,
        doMakeUserConfirmPassword,
      })
    ),
    defaultValues: {
      firstName: firstNameAttr?.value ?? "",
      lastName: lastNameAttr?.value ?? "",
      "user.attributes.tcKimlikNo": attrs.tcKimlikNo?.value ?? "",
      "user.attributes.birthDate": attrs.birthDate?.value ?? "",
      username: usernameAttr?.value ?? "",
      email: emailAttr?.value ?? "",
      "user.attributes.phone": attrs.phone?.value ?? "",
      password: "",
      "password-confirm": "",
      "user.attributes.kvkkAccepted": "false",
      "user.attributes.userAgreementAccepted": "false",
      "user.attributes.marketingConsent": "false",
    } as unknown as RegisterFormValues,
  })

  const goNext = async () => {
    const ok = await form.trigger(
      step.fields as readonly FieldPath<RegisterFormValues>[]
    )
    if (ok) setStepIndex((i) => Math.min(i + 1, REGISTER_STEPS.length - 1))
  }

  const onValid = () => {
    formRef.current?.submit()
  }

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
          className="space-y-2"
          onSubmit={form.handleSubmit(onValid)}
        >
          {/* Step 1: personal */}
          <div className={cn("space-y-2", step.id !== "personal" && "hidden")}>
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
                          {firstNameAttr?.required && (
                            <span className="ml-0.5 text-destructive">*</span>
                          )}
                        </>
                      }
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      disabled={firstNameAttr?.readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                          {lastNameAttr?.required && (
                            <span className="ml-0.5 text-destructive">*</span>
                          )}
                        </>
                      }
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      disabled={lastNameAttr?.readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user.attributes.tcKimlikNo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      variant="floating"
                      label={
                        <>
                          TC Kimlik No
                          <span className="ml-0.5 text-destructive">*</span>
                        </>
                      }
                      id="tcKimlikNo"
                      name="user.attributes.tcKimlikNo"
                      type="text"
                      inputMode="numeric"
                      maxLength={11}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user.attributes.birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      variant="floating"
                      label={
                        <>
                          Doğum Tarihi
                          <span className="ml-0.5 text-destructive">*</span>
                        </>
                      }
                      id="birthDate"
                      name="user.attributes.birthDate"
                      type="date"
                      autoComplete="bday"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Step 2: contact + auth */}
          <div className={cn("space-y-2", step.id !== "contact" && "hidden")}>
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

            <FormField
              control={form.control}
              name="user.attributes.phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      variant="floating"
                      label={
                        <>
                          Telefon
                          <span className="ml-0.5 text-destructive">*</span>
                        </>
                      }
                      id="phone"
                      name="user.attributes.phone"
                      type="tel"
                      autoComplete="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {passwordRequired && (
              <>
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
                          <Input
                            {...field}
                            type="password"
                            variant="floating"
                            label={
                              <>
                                {msg("passwordConfirm")}
                                <span className="ml-0.5 text-destructive">
                                  *
                                </span>
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
          </div>

          {/* Step 3: consents */}
          <div className={cn("space-y-2", step.id !== "consents" && "hidden")}>
            <ConsentCheckbox
              form={form}
              name="user.attributes.kvkkAccepted"
              title="KVKK Aydınlatma Metni"
              description={
                <>
                  6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında{" "}
                  <a
                    href="/terms/kvkk"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    aydınlatma metnini
                  </a>{" "}
                  okudum ve kabul ediyorum.
                </>
              }
            />
            <ConsentCheckbox
              form={form}
              name="user.attributes.userAgreementAccepted"
              title="Kullanıcı Sözleşmesi"
              description={
                <>
                  <a
                    href="/terms/user-agreement"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Kullanıcı sözleşmesini
                  </a>{" "}
                  okudum ve kabul ediyorum.
                </>
              }
            />
            <ConsentCheckbox
              form={form}
              optional
              name="user.attributes.marketingConsent"
              title="Ticari elektronik ileti onayı"
              description="Tarafıma kampanya ve duyuruların e-posta / SMS yoluyla gönderilmesini onaylıyorum."
            />
          </div>

          {recaptchaRequired &&
            isLastStep &&
            (recaptchaVisible || recaptchaAction === undefined) && (
              <div
                className="g-recaptcha"
                data-size="compact"
                data-sitekey={recaptchaSiteKey}
                data-action={recaptchaAction}
              />
            )}

          {!isLastStep ? (
            <Button type="button" size="xl" className="w-full" onClick={goNext}>
              Devam
            </Button>
          ) : recaptchaRequired &&
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
              disabled={form.formState.isSubmitting}
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

// ─────────────────────────────────────────────────────────────────────────

function ConsentCheckbox({
  form,
  name,
  title,
  description,
  optional,
}: {
  form: ReturnType<typeof useForm<RegisterFormValues>>
  name: FieldPath<RegisterFormValues>
  title: string
  description: React.ReactNode
  optional?: boolean
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const checked = field.value === "true"
        return (
          <FormItem className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <FormControl>
                <Checkbox
                  id={name}
                  checked={checked}
                  onCheckedChange={(v) => field.onChange(v ? "true" : "false")}
                />
              </FormControl>
              <input type="hidden" name={name} value={field.value ?? "false"} />
              <div className="space-y-1">
                <label
                  htmlFor={name}
                  className="cursor-pointer font-medium text-sm leading-none"
                >
                  {title}
                  {!optional && (
                    <span className="ml-0.5 text-destructive">*</span>
                  )}
                </label>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
