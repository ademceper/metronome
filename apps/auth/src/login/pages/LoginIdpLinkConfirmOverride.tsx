import { Button } from "@metronome/ui/components/button"
import { Link } from "@metronome/ui/components/link"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginIdpLinkConfirmOverride(
  props: PageProps<
    Extract<KcContext, { pageId: "login-idp-link-confirm-override.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, idpDisplayName } = kcContext
  const { msg } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("confirmOverrideIdpTitle")}
    >
      <form
        id="kc-register-form"
        action={url.loginAction}
        method="post"
        className="space-y-4"
      >
        <p className="text-muted-foreground text-sm">
          {msg("pageExpiredMsg1")}{" "}
          <Link id="loginRestartLink" href={url.loginRestartFlowUrl}>
            {msg("doClickHere")}
          </Link>
        </p>
        <Button
          size="xl"
          type="submit"
          className="w-full"
          name="submitAction"
          id="confirmOverride"
          value="confirmOverride"
        >
          {msg("confirmOverrideIdpContinue", idpDisplayName)}
        </Button>
      </form>
    </Template>
  )
}
