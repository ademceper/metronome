import { getKcClsx } from "keycloakify/login/lib/kcClsx"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import type { JSX } from "keycloakify/tools/JSX"
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot"
import { useState } from "react"
import { KcSubmit } from "../components/kc-form"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

type IdpReviewUserProfileProps = PageProps<
  Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>,
  I18n
> & {
  UserProfileFormFields: LazyOrNot<
    (props: UserProfileFormFieldsProps) => JSX.Element
  >
  doMakeUserConfirmPassword: boolean
}

export default function IdpReviewUserProfile(props: IdpReviewUserProfileProps) {
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

  const { msg, msgStr } = i18n

  const { url, messagesPerField } = kcContext

  const [isFomSubmittable, setIsFomSubmittable] = useState(false)

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={messagesPerField.exists("global")}
      headerNode={msg("loginIdpReviewProfileTitle")}
    >
      <form
        id="kc-idp-review-profile-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          onIsFormSubmittableValueChange={setIsFomSubmittable}
          kcClsx={kcClsx}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />
        <KcSubmit label={msgStr("doSubmit")} disabled={!isFomSubmittable} />
      </form>
    </Template>
  )
}
