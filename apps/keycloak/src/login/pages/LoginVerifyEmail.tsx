import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginVerifyEmail(
  props: PageProps<
    Extract<KcContext, { pageId: "login-verify-email.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { msg } = i18n
  const { url, user } = kcContext

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayInfo
      headerNode={msg("emailVerifyTitle")}
      infoNode={
        <p className="text-muted-foreground text-sm">
          {msg("emailVerifyInstruction2")}
          <br />
          <a
            href={url.loginAction}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {msg("doClickHere")}
          </a>{" "}
          {msg("emailVerifyInstruction3")}
        </p>
      }
    >
      <p className="text-muted-foreground text-sm">
        {msg("emailVerifyInstruction1", user?.email ?? "")}
      </p>
    </Template>
  )
}
