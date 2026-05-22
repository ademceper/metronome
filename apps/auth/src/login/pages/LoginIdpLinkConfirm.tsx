import { Button } from "@metronome/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginIdpLinkConfirm(
  props: PageProps<
    Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, idpAlias } = kcContext
  const { msg } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("confirmLinkIdpTitle")}
    >
      <form
        id="kc-register-form"
        action={url.loginAction}
        method="post"
        className="space-y-2"
      >
        <Button
          size="xl"
          type="submit"
          variant="outline"
          className="w-full"
          name="submitAction"
          id="updateProfile"
          value="updateProfile"
        >
          {msg("confirmLinkIdpReviewProfile")}
        </Button>
        <Button
          size="xl"
          type="submit"
          className="w-full"
          name="submitAction"
          id="linkAccount"
          value="linkAccount"
        >
          {msg("confirmLinkIdpContinue", idpAlias)}
        </Button>
      </form>
    </Template>
  )
}
