import { Link } from "@metronome/ui/components/link"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function Info(
  props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { advancedMsgStr, msg } = i18n
  const {
    messageHeader,
    message,
    requiredActions,
    skipLink,
    pageRedirectUri,
    actionUri,
    client,
  } = kcContext

  const bodyHtml = (() => {
    let html = message.summary?.trim() ?? ""
    if (requiredActions) {
      html += ` <b>${requiredActions
        .map((action) => advancedMsgStr(`requiredAction.${action}`))
        .join(", ")}</b>`
    }
    return html
  })()

  const link = (() => {
    if (skipLink) return null
    if (pageRedirectUri)
      return { href: pageRedirectUri, label: msg("backToApplication") }
    if (actionUri) return { href: actionUri, label: msg("proceedWithAction") }
    if (client.baseUrl)
      return { href: client.baseUrl, label: msg("backToApplication") }
    return null
  })()

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={
        <span
          dangerouslySetInnerHTML={{
            __html: kcSanitize(
              messageHeader ? advancedMsgStr(messageHeader) : message.summary
            ),
          }}
        />
      }
    >
      <div className="space-y-2">
        <p
          className="text-muted-foreground text-sm"
          dangerouslySetInnerHTML={{ __html: kcSanitize(bodyHtml) }}
        />
        {link && <Link href={link.href}>{link.label}</Link>}
      </div>
    </Template>
  )
}
