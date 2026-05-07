import { Button } from "@metronome/ui/components/button"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useEffect, useState } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function SamlPostForm(
  props: PageProps<Extract<KcContext, { pageId: "saml-post-form.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { msgStr, msg } = i18n
  const { samlPost } = kcContext

  const [htmlFormElement, setHtmlFormElement] =
    useState<HTMLFormElement | null>(null)

  useEffect(() => {
    if (htmlFormElement === null) {
      return
    }

    // Storybook
    if (samlPost.url === "#") {
      alert("In a real Keycloak the user would be redirected immediately")
      return
    }

    htmlFormElement.requestSubmit()
  }, [htmlFormElement, samlPost.url])

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("saml.post-form.title")}
    >
      <p className="text-muted-foreground text-sm">
        {msg("saml.post-form.message")}
      </p>
      <form
        name="saml-post-binding"
        method="post"
        action={samlPost.url}
        ref={setHtmlFormElement}
      >
        {samlPost.SAMLRequest && (
          <input
            type="hidden"
            name="SAMLRequest"
            value={samlPost.SAMLRequest}
          />
        )}
        {samlPost.SAMLResponse && (
          <input
            type="hidden"
            name="SAMLResponse"
            value={samlPost.SAMLResponse}
          />
        )}
        {samlPost.relayState && (
          <input type="hidden" name="RelayState" value={samlPost.relayState} />
        )}
        <noscript>
          <p className="text-muted-foreground text-sm">
            {msg("saml.post-form.js-disabled")}
          </p>
          <Button size="lg" type="submit" className="w-full">
            {msgStr("doContinue")}
          </Button>
        </noscript>
      </form>
    </Template>
  )
}
