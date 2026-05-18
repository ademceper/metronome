import { AnimatedLink } from "@metronome/ui/components/animated-link"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginIdpLinkEmail(
  props: PageProps<
    Extract<KcContext, { pageId: "login-idp-link-email.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, realm, brokerContext, idpAlias } = kcContext
  const { msg } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("emailLinkIdpTitle", idpAlias)}
    >
      <div className="space-y-3">
        <p id="instruction1" className="text-muted-foreground text-sm">
          {msg(
            "emailLinkIdp1",
            idpAlias,
            brokerContext.username,
            realm.displayName
          )}
        </p>
        <p id="instruction2" className="text-muted-foreground text-sm">
          {msg("emailLinkIdp2")}{" "}
          <AnimatedLink href={url.loginAction}>
            {msg("doClickHere")}
          </AnimatedLink>{" "}
          {msg("emailLinkIdp3")}
        </p>
        <p id="instruction3" className="text-muted-foreground text-sm">
          {msg("emailLinkIdp4")}{" "}
          <AnimatedLink href={url.loginAction}>
            {msg("doClickHere")}
          </AnimatedLink>{" "}
          {msg("emailLinkIdp5")}
        </p>
      </div>
    </Template>
  )
}
