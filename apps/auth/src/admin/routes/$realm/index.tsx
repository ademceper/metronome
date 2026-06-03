// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { Button as UIButton } from "@metronome/ui/components/button"
import { useTranslation } from "react-i18next"
import { label, useEnvironment, KeycloakSpinner } from "../../../shared/keycloak-ui-shared"
import { useRealm } from "../../context/realm-context/realm-context"
import { useServerInfo } from "../../context/server-info/server-info-provider"
import helpUrls from "../../help-urls"

function Welcome() {
  const { t } = useTranslation()
  const { realm, realmRepresentation: realmInfo } = useRealm()
  const serverInfo = useServerInfo()

  if (Object.keys(serverInfo).length === 0) {
    return <KeycloakSpinner />
  }

  const realmDisplayInfo = label(t, realmInfo?.displayName, realm)

  return (
    <div className="px-8 py-12">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-3">
          <h1
            data-testid="welcomeTitle"
            className="font-semibold text-3xl leading-tight tracking-tight"
          >
            {t("welcomeTo", { realmDisplayInfo })}
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
            Manage user federation, strong authentication, user management,
            fine-grained authorization, and more. Add authentication to
            applications and secure services with minimum effort — no need
            to deal with storing or authenticating users yourself.
          </p>
        </div>

        <div>
          <UIButton asChild size="lg">
            <a
              href={helpUrls.documentation}
              target="_blank"
              rel="noreferrer"
            >
              {t("viewDocumentation")}
            </a>
          </UIButton>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/$realm/")({
  component: Welcome,
})
