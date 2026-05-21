import type { ClassKey } from "keycloakify/login"
import { lazy, Suspense } from "react"
import { useI18n } from "./i18n"
import type { KcContext } from "./KcContext"
import Template from "./Template"

const Code = lazy(() => import("./pages/Code"))
const DeleteAccountConfirm = lazy(() => import("./pages/DeleteAccountConfirm"))
const DeleteCredential = lazy(() => import("./pages/DeleteCredential"))
const Error = lazy(() => import("./pages/Error"))
const FrontchannelLogout = lazy(() => import("./pages/FrontchannelLogout"))
const IdpReviewUserProfile = lazy(() => import("./pages/IdpReviewUserProfile"))
const Info = lazy(() => import("./pages/Info"))
const LinkIdpAction = lazy(() => import("./pages/LinkIdpAction"))
const Login = lazy(() => import("./pages/Login"))
const LoginConfigTotp = lazy(() => import("./pages/LoginConfigTotp"))
const LoginIdpLinkConfirm = lazy(() => import("./pages/LoginIdpLinkConfirm"))
const LoginIdpLinkConfirmOverride = lazy(
  () => import("./pages/LoginIdpLinkConfirmOverride")
)
const LoginIdpLinkEmail = lazy(() => import("./pages/LoginIdpLinkEmail"))
const LoginOauth2DeviceVerifyUserCode = lazy(
  () => import("./pages/LoginOauth2DeviceVerifyUserCode")
)
const LoginOauthGrant = lazy(() => import("./pages/LoginOauthGrant"))
const LoginOtp = lazy(() => import("./pages/LoginOtp"))
const LoginPageExpired = lazy(() => import("./pages/LoginPageExpired"))
const LoginPasskeysConditionalAuthenticate = lazy(
  () => import("./pages/LoginPasskeysConditionalAuthenticate")
)
const LoginPassword = lazy(() => import("./pages/LoginPassword"))
const LoginRecoveryAuthnCodeConfig = lazy(
  () => import("./pages/LoginRecoveryAuthnCodeConfig")
)
const LoginRecoveryAuthnCodeInput = lazy(
  () => import("./pages/LoginRecoveryAuthnCodeInput")
)
const LoginResetOtp = lazy(() => import("./pages/LoginResetOtp"))
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"))
const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"))
const LoginUpdateProfile = lazy(() => import("./pages/LoginUpdateProfile"))
const LoginUsername = lazy(() => import("./pages/LoginUsername"))
const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"))
const LoginX509Info = lazy(() => import("./pages/LoginX509Info"))
const LogoutConfirm = lazy(() => import("./pages/LogoutConfirm"))
const Register = lazy(() => import("./pages/Register"))
const SamlPostForm = lazy(() => import("./pages/SamlPostForm"))
const SelectAuthenticator = lazy(() => import("./pages/SelectAuthenticator"))
const SelectOrganization = lazy(() => import("./pages/SelectOrganization"))
const Terms = lazy(() => import("./pages/Terms"))
const UpdateEmail = lazy(() => import("./pages/UpdateEmail"))
const WebauthnAuthenticate = lazy(() => import("./pages/WebauthnAuthenticate"))
const WebauthnError = lazy(() => import("./pages/WebauthnError"))
const WebauthnRegister = lazy(() => import("./pages/WebauthnRegister"))

const doMakeUserConfirmPassword = true

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props
  const { i18n } = useI18n({ kcContext })

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
          case "code.ftl":
            return (
              <Code
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "delete-account-confirm.ftl":
            return (
              <DeleteAccountConfirm
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "delete-credential.ftl":
            return (
              <DeleteCredential
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "error.ftl":
            return (
              <Error
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "frontchannel-logout.ftl":
            return (
              <FrontchannelLogout
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "idp-review-user-profile.ftl":
            return (
              <IdpReviewUserProfile
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "info.ftl":
            return (
              <Info
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "link-idp-action.ftl":
            return (
              <LinkIdpAction
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login.ftl":
            return (
              <Login
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-config-totp.ftl":
            return (
              <LoginConfigTotp
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-idp-link-confirm.ftl":
            return (
              <LoginIdpLinkConfirm
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-idp-link-confirm-override.ftl":
            return (
              <LoginIdpLinkConfirmOverride
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-idp-link-email.ftl":
            return (
              <LoginIdpLinkEmail
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-oauth2-device-verify-user-code.ftl":
            return (
              <LoginOauth2DeviceVerifyUserCode
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-oauth-grant.ftl":
            return (
              <LoginOauthGrant
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-otp.ftl":
            return (
              <LoginOtp
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-page-expired.ftl":
            return (
              <LoginPageExpired
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-passkeys-conditional-authenticate.ftl":
            return (
              <LoginPasskeysConditionalAuthenticate
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-password.ftl":
            return (
              <LoginPassword
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-recovery-authn-code-config.ftl":
            return (
              <LoginRecoveryAuthnCodeConfig
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-recovery-authn-code-input.ftl":
            return (
              <LoginRecoveryAuthnCodeInput
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-reset-otp.ftl":
            return (
              <LoginResetOtp
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-reset-password.ftl":
            return (
              <LoginResetPassword
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-update-password.ftl":
            return (
              <LoginUpdatePassword
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-update-profile.ftl":
            return (
              <LoginUpdateProfile
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-username.ftl":
            return (
              <LoginUsername
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-verify-email.ftl":
            return (
              <LoginVerifyEmail
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "login-x509-info.ftl":
            return (
              <LoginX509Info
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "logout-confirm.ftl":
            return (
              <LogoutConfirm
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "register.ftl":
            return (
              <Register
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            )
          case "saml-post-form.ftl":
            return (
              <SamlPostForm
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "select-authenticator.ftl":
            return (
              <SelectAuthenticator
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "select-organization.ftl":
            return (
              <SelectOrganization
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "terms.ftl":
            return (
              <Terms
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "update-email.ftl":
            return (
              <UpdateEmail
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "webauthn-authenticate.ftl":
            return (
              <WebauthnAuthenticate
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "webauthn-error.ftl":
            return (
              <WebauthnError
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          case "webauthn-register.ftl":
            return (
              <WebauthnRegister
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            )
          default:
            return null
        }
      })()}
    </Suspense>
  )
}

const classes = {} satisfies { [key in ClassKey]?: string }
