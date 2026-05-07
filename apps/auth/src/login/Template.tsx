import { Alert, AlertDescription } from "@metronome/ui/components/alert"
import { Button } from "@metronome/ui/components/button"
import { Input } from "@metronome/ui/components/input"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import { useInitialize } from "keycloakify/login/Template.useInitialize"
import type { TemplateProps } from "keycloakify/login/TemplateProps"
import { useEffect } from "react"
import type { I18n } from "./i18n"
import type { KcContext } from "./KcContext"

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    kcContext,
    i18n,
    doUseDefaultCss,
    children,
  } = props

  const { msg, msgStr, currentLanguage, enabledLanguages } = i18n
  const { realm, auth, url, message, isAppInitiatedAction } = kcContext

  useEffect(() => {
    document.title =
      documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name)
  }, [realm.name, realm.displayName, msgStr, documentTitle])

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss })

  if (!isReadyToRender) {
    return null
  }

  const alertVariant = message?.type === "error" ? "destructive" : "default"

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        {realm.displayName || realm.name ? (
          <p className="text-center font-medium text-muted-foreground text-sm">
            {realm.displayName || realm.name}
          </p>
        ) : null}

        <div className="space-y-3">
          {enabledLanguages.length > 1 && (
            <div className="flex justify-end">
              {/* biome-ignore lint/a11y/useSemanticElements: native select is fine here */}
              <select
                aria-label={msgStr("languages")}
                className="rounded-md border border-input bg-transparent px-2 py-1 text-sm"
                defaultValue={currentLanguage.languageTag}
                onChange={(event) => {
                  const target = enabledLanguages.find(
                    (lang) => lang.languageTag === event.target.value
                  )
                  if (target) {
                    window.location.href = target.href
                  }
                }}
              >
                {enabledLanguages.map(({ languageTag, label }) => (
                  <option key={languageTag} value={languageTag}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {auth?.showUsername && !auth.showResetCredentials ? (
            <div className="space-y-1 text-center">
              <p className="font-medium">{auth.attemptedUsername}</p>
              <a
                href={url.loginRestartFlowUrl}
                className="text-primary text-sm hover:underline"
              >
                {msg("restartLoginTooltip")}
              </a>
            </div>
          ) : (
            <h1 className="text-center font-semibold text-2xl tracking-tight">
              {headerNode}
            </h1>
          )}

          {displayRequiredFields && (
            <p className="text-center text-muted-foreground text-xs">
              <span className="text-destructive">*</span>{" "}
              {msg("requiredFields")}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {displayMessage &&
            message !== undefined &&
            (message.type !== "warning" || !isAppInitiatedAction) && (
              <Alert variant={alertVariant}>
                <AlertDescription
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: keycloak message is sanitized
                  dangerouslySetInnerHTML={{
                    __html: kcSanitize(message.summary),
                  }}
                />
              </Alert>
            )}

          {children}

          {auth?.showTryAnotherWayLink && (
            <form
              id="kc-select-try-another-way-form"
              action={url.loginAction}
              method="post"
              className="text-center"
            >
              <Input type="hidden" name="tryAnotherWay" value="on" />
              <Button type="submit" variant="link">
                {msg("doTryAnotherWay")}
              </Button>
            </form>
          )}

          {socialProvidersNode}

          {displayInfo && infoNode ? (
            <div className="border-t pt-4 text-center text-muted-foreground text-sm">
              {infoNode}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
