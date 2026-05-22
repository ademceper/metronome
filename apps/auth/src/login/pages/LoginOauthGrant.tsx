import { Button } from "@metronome/ui/components/button"
import { Link } from "@metronome/ui/components/link"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginOauthGrant(
  props: PageProps<
    Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, classes, Template } = props
  const { url, oauth, client } = kcContext
  const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      bodyClassName="oauth"
      headerNode={
        <>
          {client.attributes.logoUri && (
            <img src={client.attributes.logoUri} alt="" className="mb-2" />
          )}
          <p>
            {client.name
              ? msg("oauthGrantTitle", advancedMsgStr(client.name))
              : msg("oauthGrantTitle", client.clientId)}
          </p>
        </>
      }
    >
      <div id="kc-oauth" className="space-y-2">
        <h3 className="font-medium text-sm">{msg("oauthGrantRequest")}</h3>
        <ul className="space-y-2 text-sm">
          {oauth.clientScopesRequested.map((clientScope) => (
            <li key={clientScope.consentScreenText}>
              <span>
                {advancedMsg(clientScope.consentScreenText)}
                {clientScope.dynamicScopeParameter && (
                  <>
                    : <b>{clientScope.dynamicScopeParameter}</b>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>

        {client.attributes.policyUri ||
          (client.attributes.tosUri && (
            <h3 className="text-sm">
              {client.name
                ? msg("oauthGrantInformation", advancedMsgStr(client.name))
                : msg("oauthGrantInformation", client.clientId)}
              {client.attributes.tosUri && (
                <>
                  {msg("oauthGrantReview")}
                  <Link href={client.attributes.tosUri} target="_blank">
                    {msg("oauthGrantTos")}
                  </Link>
                </>
              )}
              {client.attributes.policyUri && (
                <>
                  {msg("oauthGrantReview")}
                  <Link href={client.attributes.policyUri} target="_blank">
                    {msg("oauthGrantPolicy")}
                  </Link>
                </>
              )}
            </h3>
          ))}

        <form action={url.oauthAction} method="POST" className="space-y-2">
          <input type="hidden" name="code" value={oauth.code} />
          <div className="grid grid-cols-2 gap-2">
            <Button size="xl" name="accept" id="kc-login" type="submit">
              {msgStr("doYes")}
            </Button>
            <Button
              size="xl"
              variant="outline"
              name="cancel"
              id="kc-cancel"
              type="submit"
            >
              {msgStr("doNo")}
            </Button>
          </div>
        </form>
      </div>
    </Template>
  )
}
