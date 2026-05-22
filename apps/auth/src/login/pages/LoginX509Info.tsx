import { Button } from "@metronome/ui/components/button"
import { Label } from "@metronome/ui/components/label"
import type { PageProps } from "keycloakify/login/pages/PageProps"
import type { I18n } from "../i18n"
import type { KcContext } from "../KcContext"

export default function LoginX509Info(
  props: PageProps<Extract<KcContext, { pageId: "login-x509-info.ftl" }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props
  const { url, x509 } = kcContext
  const { msg, msgStr } = i18n

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg("doLogIn")}
    >
      <form
        id="kc-x509-login-info"
        action={url.loginAction}
        method="post"
        className="space-y-2"
      >
        <div className="space-y-2">
          <Label htmlFor="certificate_subjectDN">
            {msg("clientCertificate")}
          </Label>
          <div
            id="certificate_subjectDN"
            className="break-all rounded-md border bg-muted/30 p-4 font-mono text-sm"
          >
            {x509.formData.subjectDN
              ? x509.formData.subjectDN
              : msg("noCertificate")}
          </div>
        </div>

        {x509.formData.isUserEnabled && (
          <div className="space-y-2">
            <Label htmlFor="username">{msg("doX509Login")}</Label>
            <div
              id="username"
              className="break-all rounded-md border bg-muted/30 p-4 font-mono text-sm"
            >
              {x509.formData.username}
            </div>
          </div>
        )}

        {x509.formData.isUserEnabled ? (
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="submit"
              size="xl"
              name="login"
              id="kc-login"
              className="w-full"
            >
              {msgStr("doContinue")}
            </Button>
            <Button
              size="xl"
              type="submit"
              variant="outline"
              name="cancel"
              id="kc-cancel"
            >
              {msgStr("doIgnore")}
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            size="xl"
            name="login"
            id="kc-login"
            className="w-full"
          >
            {msgStr("doContinue")}
          </Button>
        )}
      </form>
    </Template>
  )
}
