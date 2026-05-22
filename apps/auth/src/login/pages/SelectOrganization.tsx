import { cn } from "@metronome/ui/lib/utils"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import { type MouseEvent, useRef, useState } from "react"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function SelectOrganization(
  props: PageProps<
    Extract<KcContext, { pageId: "select-organization.ftl" }>,
    I18n
  >
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, user } = kcContext
  const { msg } = i18n

  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const organizationInputRef = useRef<HTMLInputElement>(null)

  const onOrganizationClick =
    (organizationAlias: string) => (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()

      if (!organizationInputRef.current || !formRef.current) {
        return
      }

      organizationInputRef.current.value = organizationAlias
      setIsSubmitting(true)

      if (typeof formRef.current.requestSubmit === "function") {
        formRef.current.requestSubmit()
        return
      }

      formRef.current.submit()
    }

  const organizations = user.organizations ?? []
  const shouldDisplayGrid = organizations.length > 3

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={null}
    >
      <form
        ref={formRef}
        action={url.loginAction}
        method="POST"
        className="space-y-2"
      >
        <div id="kc-user-organizations" className="space-y-2">
          <h2 className="font-semibold text-lg">
            {msg("organization.select")}
          </h2>
          <ul
            className={cn(
              "gap-2",
              shouldDisplayGrid ? "grid grid-cols-2" : "flex flex-col"
            )}
          >
            {organizations.map(({ alias, name }) => (
              <li key={alias}>
                <button
                  id={`organization-${alias}`}
                  type="button"
                  onClick={onOrganizationClick(alias)}
                  disabled={isSubmitting}
                  className="flex w-full items-center rounded-lg border p-4 text-left transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="font-medium">{name ?? alias}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <input ref={organizationInputRef} type="hidden" name="kc.org" />
      </form>
    </Template>
  )
}
