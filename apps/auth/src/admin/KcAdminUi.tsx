import { useEffect, useReducer } from "react"
import { KeycloakProvider } from "../shared/keycloak-ui-shared"
import { SessionExpirationWarningOverlay } from "../shared/SessionExpirationWarningOverlay"
import { Root } from "./app/Root"
import { startColorSchemeManagement } from "./colorScheme"
import { environment } from "./environment"
import { i18n } from "./i18n/i18n"

document.title = "Keycloak Administration Console"

const prI18nInitialized = i18n.init()
startColorSchemeManagement()

export default function KcAdminUi() {
  const [isI18nInitialized, setI18nInitialized] = useReducer(() => true, false)

  useEffect(() => {
    prI18nInitialized.then(() => setI18nInitialized())
  }, [])

  if (!isI18nInitialized) {
    return null
  }

  return (
    <KeycloakProvider environment={environment}>
      <Root />
      <SessionExpirationWarningOverlay warnUserSecondsBeforeAutoLogout={45} />
    </KeycloakProvider>
  )
}
