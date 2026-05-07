import { Button } from "@metronome/ui/components/button"
import { getKcClsx } from "keycloakify/login/lib/kcClsx"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import type { JSX } from "keycloakify/tools/JSX"
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot"
import { useState } from "react"
import { KcSubmit } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

type LoginUpdateProfileProps = PageProps<
  Extract<KcContext, { pageId: "login-update-profile.ftl" }>,
  I18n
> & {
  UserProfileFormFields: LazyOrNot<
    (props: UserProfileFormFieldsProps) => JSX.Element
  >
  doMakeUserConfirmPassword: boolean
}

export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
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

  const { messagesPerField, url, isAppInitiatedAction } = kcContext

  const { msg, msgStr } = i18n

  const [isFormSubmittable, setIsFormSubmittable] = useState(false)

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("loginProfileTitle")}
      displayMessage={messagesPerField.exists("global")}
    >
      <form
        id="kc-update-profile-form"
        action={url.loginAction}
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

        <div className="flex flex-col gap-2">
          <KcSubmit label={msgStr("doSubmit")} disabled={!isFormSubmittable} />
          {isAppInitiatedAction && (
            <Button
              size="lg"
              type="submit"
              variant="outline"
              name="cancel-aia"
              value="true"
              formNoValidate
            >
              {msg("doCancel")}
            </Button>
          )}
        </div>
      </form>
    </Template>
  )
}
