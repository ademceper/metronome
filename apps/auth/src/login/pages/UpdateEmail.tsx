import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import { Label } from "@metronome/ui/components/label"
import { getKcClsx } from "keycloakify/login/lib/kcClsx"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import type { JSX } from "keycloakify/tools/JSX"
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot"
import { useState } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

type UpdateEmailProps = PageProps<
  Extract<KcContext, { pageId: "update-email.ftl" }>,
  I18n
> & {
  UserProfileFormFields: LazyOrNot<
    (props: UserProfileFormFieldsProps) => JSX.Element
  >
  doMakeUserConfirmPassword: boolean
}

export default function UpdateEmail(props: UpdateEmailProps) {
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

  const [isFormSubmittable, setIsFormSubmittable] = useState(false)

  const { url, messagesPerField, isAppInitiatedAction } = kcContext

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
      <form
        id="kc-update-email-form"
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

        <LogoutOtherSessions i18n={i18n} />

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            size="xl"
            className="w-full"
            disabled={!isFormSubmittable}
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
    </Template>
  )
}

function LogoutOtherSessions(props: { i18n: I18n }) {
  const { i18n } = props
  const { msg } = i18n

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="logout-sessions"
        name="logout-sessions"
        value="on"
        defaultChecked
      />
      <Label htmlFor="logout-sessions">{msg("logoutOtherSessions")}</Label>
    </div>
  )
}
