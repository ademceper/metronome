import { Input } from "@metronome/ui/components/input"
import { Check, Copy } from "@phosphor-icons/react"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { useState } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function Code(
  props: PageProps<Extract<KcContext, { pageId: "code.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { code } = kcContext
  const { msg } = i18n

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!code.code) return
    try {
      await navigator.clipboard.writeText(code.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={
        code.success
          ? msg("codeSuccessTitle")
          : msg("codeErrorTitle", code.error)
      }
    >
      <div id="kc-code" className="space-y-3">
        {code.success ? (
          <>
            <p className="text-muted-foreground text-sm">
              {msg("copyCodeInstruction")}
            </p>
            <div className="relative">
              <Input
                id="code"
                defaultValue={code.code}
                readOnly
                className="h-12 pr-12 text-center"
              />
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Copied" : "Copy"}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <Check className="size-5 text-emerald-500" aria-hidden />
                ) : (
                  <Copy className="size-5" aria-hidden />
                )}
              </button>
            </div>
          </>
        ) : (
          code.error && (
            <p
              id="error"
              className="text-destructive text-sm"
              aria-live="polite"
              dangerouslySetInnerHTML={{
                __html: kcSanitize(code.error),
              }}
            />
          )
        )}
      </div>
    </Template>
  )
}
