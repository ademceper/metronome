import { Button } from "@metronome/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useEffect, useState } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function FrontchannelLogout(
  props: PageProps<
    Extract<KcContext, { pageId: "frontchannel-logout.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { logout } = kcContext
  const { msg, msgStr } = i18n

  const [iframeLoadCount, setIframeLoadCount] = useState(0)

  useEffect(() => {
    if (!kcContext.logout.logoutRedirectUri) {
      return
    }

    if (iframeLoadCount !== kcContext.logout.clients.length) {
      return
    }

    window.location.replace(kcContext.logout.logoutRedirectUri)
  }, [
    iframeLoadCount,
    kcContext.logout.logoutRedirectUri,
    kcContext.logout.clients.length,
  ])

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      documentTitle={msgStr("frontchannel-logout.title")}
      headerNode={msg("frontchannel-logout.title")}
    >
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          {msg("frontchannel-logout.message")}
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {logout.clients.map((client) => (
            <li key={client.name}>
              {client.name}
              <iframe
                src={client.frontChannelLogoutUrl}
                style={{ display: "none" }}
                onLoad={() => {
                  setIframeLoadCount((count) => count + 1)
                }}
              />
            </li>
          ))}
        </ul>
        {logout.logoutRedirectUri !== undefined && (
          <Button size="lg" asChild className="w-full">
            <a id="continue" href={logout.logoutRedirectUri}>
              {msg("doContinue")}
            </a>
          </Button>
        )}
      </div>
    </Template>
  )
}
