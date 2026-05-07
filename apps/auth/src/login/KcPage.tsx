import type { ClassKey } from "keycloakify/login"
import DefaultPage from "keycloakify/login/DefaultPage"
import { lazy, Suspense } from "react"
import { useI18n } from "./i18n"
import type { KcContext } from "./KcContext"
import Template from "./Template"
import UserProfileFormFields from "./UserProfileFormFields"

const doMakeUserConfirmPassword = true

const Code = lazy(() => import("./pages/Code"))
const DeleteAccountConfirm = lazy(() => import("./pages/DeleteAccountConfirm"))
const DeleteCredential = lazy(() => import("./pages/DeleteCredential"))
const ErrorPage = lazy(() => import("./pages/Error"))
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

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props

  const { i18n } = useI18n({ kcContext })

  const common = { i18n, classes, Template, doUseDefaultCss: false } as const
  const profileForm = { UserProfileFormFields, doMakeUserConfirmPassword }

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
          case "code.ftl":
            return <Code kcContext={kcContext} {...common} />
          case "delete-account-confirm.ftl":
            return <DeleteAccountConfirm kcContext={kcContext} {...common} />
          case "delete-credential.ftl":
            return <DeleteCredential kcContext={kcContext} {...common} />
          case "error.ftl":
            return <ErrorPage kcContext={kcContext} {...common} />
          case "frontchannel-logout.ftl":
            return <FrontchannelLogout kcContext={kcContext} {...common} />
          case "idp-review-user-profile.ftl":
            return (
              <IdpReviewUserProfile
                kcContext={kcContext}
                {...common}
                {...profileForm}
              />
            )
          case "info.ftl":
            return <Info kcContext={kcContext} {...common} />
          case "link-idp-action.ftl":
            return <LinkIdpAction kcContext={kcContext} {...common} />
          case "login.ftl":
            return <Login kcContext={kcContext} {...common} />
          case "login-config-totp.ftl":
            return <LoginConfigTotp kcContext={kcContext} {...common} />
          case "login-idp-link-confirm.ftl":
            return <LoginIdpLinkConfirm kcContext={kcContext} {...common} />
          case "login-idp-link-confirm-override.ftl":
            return (
              <LoginIdpLinkConfirmOverride kcContext={kcContext} {...common} />
            )
          case "login-idp-link-email.ftl":
            return <LoginIdpLinkEmail kcContext={kcContext} {...common} />
          case "login-oauth2-device-verify-user-code.ftl":
            return (
              <LoginOauth2DeviceVerifyUserCode
                kcContext={kcContext}
                {...common}
              />
            )
          case "login-oauth-grant.ftl":
            return <LoginOauthGrant kcContext={kcContext} {...common} />
          case "login-otp.ftl":
            return <LoginOtp kcContext={kcContext} {...common} />
          case "login-page-expired.ftl":
            return <LoginPageExpired kcContext={kcContext} {...common} />
          case "login-passkeys-conditional-authenticate.ftl":
            return (
              <LoginPasskeysConditionalAuthenticate
                kcContext={kcContext}
                {...common}
              />
            )
          case "login-password.ftl":
            return <LoginPassword kcContext={kcContext} {...common} />
          case "login-recovery-authn-code-config.ftl":
            return (
              <LoginRecoveryAuthnCodeConfig kcContext={kcContext} {...common} />
            )
          case "login-recovery-authn-code-input.ftl":
            return (
              <LoginRecoveryAuthnCodeInput kcContext={kcContext} {...common} />
            )
          case "login-reset-otp.ftl":
            return <LoginResetOtp kcContext={kcContext} {...common} />
          case "login-reset-password.ftl":
            return <LoginResetPassword kcContext={kcContext} {...common} />
          case "login-update-password.ftl":
            return <LoginUpdatePassword kcContext={kcContext} {...common} />
          case "login-update-profile.ftl":
            return (
              <LoginUpdateProfile
                kcContext={kcContext}
                {...common}
                {...profileForm}
              />
            )
          case "login-username.ftl":
            return <LoginUsername kcContext={kcContext} {...common} />
          case "login-verify-email.ftl":
            return <LoginVerifyEmail kcContext={kcContext} {...common} />
          case "login-x509-info.ftl":
            return <LoginX509Info kcContext={kcContext} {...common} />
          case "logout-confirm.ftl":
            return <LogoutConfirm kcContext={kcContext} {...common} />
          case "register.ftl":
            return (
              <Register kcContext={kcContext} {...common} {...profileForm} />
            )
          case "saml-post-form.ftl":
            return <SamlPostForm kcContext={kcContext} {...common} />
          case "select-authenticator.ftl":
            return <SelectAuthenticator kcContext={kcContext} {...common} />
          case "select-organization.ftl":
            return <SelectOrganization kcContext={kcContext} {...common} />
          case "terms.ftl":
            return <Terms kcContext={kcContext} {...common} />
          case "update-email.ftl":
            return (
              <UpdateEmail kcContext={kcContext} {...common} {...profileForm} />
            )
          case "webauthn-authenticate.ftl":
            return <WebauthnAuthenticate kcContext={kcContext} {...common} />
          case "webauthn-error.ftl":
            return <WebauthnError kcContext={kcContext} {...common} />
          case "webauthn-register.ftl":
            return <WebauthnRegister kcContext={kcContext} {...common} />
          default:
            return (
              <DefaultPage kcContext={kcContext} {...common} {...profileForm} />
            )
        }
      })()}
    </Suspense>
  )
}

const classes = {} satisfies { [key in ClassKey]?: string }
