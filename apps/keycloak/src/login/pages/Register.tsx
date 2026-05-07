import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import { Label } from "@metronome/ui/components/label"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import { getKcClsx } from "keycloakify/login/lib/kcClsx"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import type { JSX } from "keycloakify/tools/JSX"
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot"
import { useLayoutEffect, useState } from "react"
import { AnimatedLink } from "../components/animated-link"
import { KcSubmit } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

type RegisterProps = PageProps<
  Extract<KcContext, { pageId: "register.ftl" }>,
  I18n
> & {
  UserProfileFormFields: LazyOrNot<
    (props: UserProfileFormFieldsProps) => JSX.Element
  >
  doMakeUserConfirmPassword: boolean
}

export default function Register(props: RegisterProps) {
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  } = props

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes })

  const {
    messageHeader,
    url,
    messagesPerField,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired,
  } = kcContext

  const { msg, msgStr, advancedMsg } = i18n

  const [isFormSubmittable, setIsFormSubmittable] = useState(false)
  const [areTermsAccepted, setAreTermsAccepted] = useState(false)

  useLayoutEffect(() => {
    ;(window as any).onSubmitRecaptcha = () => {
      // @ts-ignore
      document.getElementById("kc-register-form").requestSubmit()
    }

    return () => {
      delete (window as any).onSubmitRecaptcha
    }
  }, [])

  const isSubmitDisabled =
    !isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)

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
      <form
        id="kc-register-form"
        action={url.registrationAction}
        method="post"
        className="space-y-4"
      >
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          kcClsx={kcClsx}
          onIsFormSubmittableValueChange={setIsFormSubmittable}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />

        {termsAcceptanceRequired && (
          <TermsAcceptance
            i18n={i18n}
            messagesPerField={messagesPerField}
            areTermsAccepted={areTermsAccepted}
            onAreTermsAcceptedValueChange={setAreTermsAccepted}
          />
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
            size="lg"
            type="submit"
            className="g-recaptcha w-full"
            data-sitekey={recaptchaSiteKey}
            data-callback="onSubmitRecaptcha"
            data-action={recaptchaAction}
          >
            {msg("doRegister")}
          </Button>
        ) : (
          <KcSubmit label={msgStr("doRegister")} disabled={isSubmitDisabled} />
        )}

        <div className="flex justify-center">
          <AnimatedLink href={url.loginUrl}>{msg("backToLogin")}</AnimatedLink>
        </div>
      </form>
    </Template>
  )
}

function TermsAcceptance(props: {
  i18n: I18n
  messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">
  areTermsAccepted: boolean
  onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void
}) {
  const {
    i18n,
    messagesPerField,
    areTermsAccepted,
    onAreTermsAcceptedValueChange,
  } = props

  const { msg } = i18n

  return (
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
            onAreTermsAcceptedValueChange(checked === true)
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
  )
}
