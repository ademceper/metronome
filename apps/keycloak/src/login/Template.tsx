import { Alert, AlertDescription } from "@metronome/ui/components/alert"
import { Button } from "@metronome/ui/components/button"
import { cn } from "@metronome/ui/lib/utils"
import {
  ArrowClockwise,
  CheckCircle,
  Info as InfoIcon,
  Warning,
  WarningCircle,
} from "@phosphor-icons/react"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import { useInitialize } from "keycloakify/login/Template.useInitialize"
import type { TemplateProps } from "keycloakify/login/TemplateProps"
import { useSetClassName } from "keycloakify/tools/useSetClassName"
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
    bodyClassName,
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
  }, [realm.name, msgStr, documentTitle, realm.displayName])

  useEffect(() => {
    if (import.meta.env.DEV) return
    if (enabledLanguages.length <= 1) return

    const KEY = "kc-lang-autoswitched"
    if (sessionStorage.getItem(KEY)) return

    const browserTag = navigator.language || navigator.languages?.[0] || ""
    if (!browserTag) return

    const match = enabledLanguages.find(
      (l) =>
        l.languageTag === browserTag ||
        l.languageTag === browserTag.split("-")[0]
    )

    if (match && match.languageTag !== currentLanguage.languageTag) {
      sessionStorage.setItem(KEY, "1")
      window.location.href = match.href
    }
  }, [
    enabledLanguages.length,
    enabledLanguages.find,
    currentLanguage.languageTag,
  ])

  useSetClassName({ qualifiedName: "html", className: "" })
  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? "bg-background text-foreground antialiased",
  })

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss })
  if (!isReadyToRender) return null

  const showUsernameHeader = auth?.showUsername && !auth.showResetCredentials

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 p-4 sm:p-8">
      <header className="text-center">
        <h1
          className="text-4xl tracking-tight"
          style={{ fontFamily: '"Climate Crisis", sans-serif' }}
        >
          {msg("loginTitleHtml", realm.displayNameHtml || realm.name)}
        </h1>
      </header>

      <div className="space-y-4">
        {showUsernameHeader ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-sm">
              {auth.attemptedUsername}
            </span>
            <Button
              asChild
              variant="ghost"
              size="sm"
              aria-label={msgStr("restartLoginTooltip")}
            >
              <a href={url.loginRestartFlowUrl}>
                <ArrowClockwise className="size-4" aria-hidden />
                <span className="sr-only">{msg("restartLoginTooltip")}</span>
              </a>
            </Button>
          </div>
        ) : (
          <h2 className="font-semibold text-xl">{headerNode}</h2>
        )}

        {displayRequiredFields && (
          <p className="text-muted-foreground text-xs">
            <span className="text-destructive">*</span> {msg("requiredFields")}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {displayMessage &&
          message !== undefined &&
          (message.type !== "warning" || !isAppInitiatedAction) && (
            <MessageAlert
              type={message.type}
              summary={message.summary}
              label={message.type}
            />
          )}

        {children}

        {auth?.showTryAnotherWayLink && (
          <form
            id="kc-select-try-another-way-form"
            action={url.loginAction}
            method="post"
            className="pt-2"
          >
            <input type="hidden" name="tryAnotherWay" value="on" />
            <Button
              size="xl"
              type="button"
              variant="link"
              className="px-0"
              onClick={(event) => {
                ;(
                  document.forms.namedItem(
                    "kc-select-try-another-way-form"
                  ) as HTMLFormElement | null
                )?.requestSubmit()
                event.preventDefault()
              }}
            >
              {msg("doTryAnotherWay")}
            </Button>
          </form>
        )}

        {socialProvidersNode}

        {displayInfo && (
          <div className="border-t pt-4 text-center text-sm">{infoNode}</div>
        )}
      </div>
    </div>
  )
}

function MessageAlert(props: {
  type: "success" | "warning" | "error" | "info"
  summary: string
  label: string
}) {
  const { type, summary, label } = props

  const Icon = (
    {
      success: CheckCircle,
      info: InfoIcon,
      warning: Warning,
      error: WarningCircle,
    } as const
  )[type]

  return (
    <Alert
      role="alert"
      aria-label={label}
      variant={type === "error" ? "destructive" : "default"}
      className={cn(
        type === "success" &&
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
        type === "warning" &&
          "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100",
        type === "info" &&
          "border-sky-500/40 bg-sky-500/10 text-sky-900 dark:text-sky-100"
      )}
    >
      <Icon className="size-4" aria-hidden />
      <AlertDescription
        dangerouslySetInnerHTML={{ __html: kcSanitize(summary) }}
      />
    </Alert>
  )
}
