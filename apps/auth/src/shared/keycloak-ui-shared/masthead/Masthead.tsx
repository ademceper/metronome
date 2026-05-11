import { Profile } from "@metronome/auth"
import { Button as UIButton } from "@metronome/ui/components/button"
import { DropdownMenuItem } from "@metronome/ui/components/dropdown-menu"
import { cn } from "@metronome/ui/lib/utils"
import { List as BarsIcon } from "@phosphor-icons/react"
import type { TFunction } from "i18next"
import type { Keycloak, KeycloakTokenParsed } from "oidc-spa/keycloak-js"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

const Masthead = ({ children, className, ...props }: any) => (
  <div
    className={cn("flex items-center gap-2 border-b px-3 py-2", className)}
    {...props}
  >
    {children}
  </div>
)
const MastheadBrand = ({ children, ...props }: any) => (
  <div className="flex items-center gap-2 font-medium" {...props}>
    {children}
  </div>
)
const MastheadContent = ({ children, className, ...props }: any) => (
  <div
    className={cn("flex flex-1 items-center justify-end gap-2", className)}
    {...props}
  >
    {children}
  </div>
)
const MastheadToggle = ({ children, className, ...props }: any) => (
  <div className={cn("inline-flex items-center", className)} {...props}>
    {children}
  </div>
)
const PageToggleButton = ({ children, onClick, ...props }: any) => (
  <UIButton type="button" variant="ghost" onClick={onClick} {...props}>
    {children}
  </UIButton>
)

type BrandLogo = {
  src?: string
  alt?: string
  className?: string
}

type KeycloakMastheadProps = {
  keycloak: Keycloak
  brand: BrandLogo
  avatar?: { src?: string; alt?: string }
  features?: {
    hasLogout?: boolean
    hasManageAccount?: boolean
    hasUsername?: boolean
  }
  dropdownItems?: ReactNode[]
  /** Legacy alias for dropdownItems — kept for compatibility, ignored if dropdownItems is set. */
  kebabDropdownItems?: ReactNode[]
  toolbarItems?: ReactNode[]
  toolbar?: ReactNode
  className?: string
}

function loggedInUserName(
  token: KeycloakTokenParsed | undefined,
  t: TFunction,
): string | undefined {
  if (!token) return undefined
  const tokenAny = token as KeycloakTokenParsed & {
    name?: string
    given_name?: string
    family_name?: string
    preferred_username?: string
  }
  if (tokenAny.given_name && tokenAny.family_name) {
    return t("fullName", {
      givenName: tokenAny.given_name,
      familyName: tokenAny.family_name,
    })
  }
  return (
    tokenAny.name ??
    tokenAny.given_name ??
    tokenAny.family_name ??
    tokenAny.preferred_username
  )
}

const KeycloakMasthead = ({
  keycloak,
  brand: { src, alt, className: brandClassName },
  avatar,
  features: { hasLogout = true, hasManageAccount = true } = {},
  dropdownItems = [],
  kebabDropdownItems,
  toolbarItems,
  toolbar,
  className,
  ...rest
}: KeycloakMastheadProps) => {
  const { t } = useTranslation()

  const token = keycloak.idTokenParsed as
    | (KeycloakTokenParsed & {
        name?: string
        email?: string
        preferred_username?: string
        picture?: string
      })
    | undefined

  const extraItems: ReactNode[] = [...dropdownItems]
  if (hasManageAccount) {
    extraItems.unshift(
      <ManageAccountItem key="manage-account" keycloak={keycloak} />,
    )
  }
  void kebabDropdownItems

  return (
    <Masthead className={className} {...rest}>
      <MastheadToggle>
        <PageToggleButton aria-label={t("navigation")}>
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadBrand>
        {src ? <img src={src} alt={alt} className={brandClassName} /> : null}
      </MastheadBrand>
      <MastheadContent>
        {toolbar}
        {toolbarItems}
        <Profile
          name={loggedInUserName(token, t)}
          email={token?.email}
          avatarUrl={avatar?.src || token?.picture}
          onSignOut={hasLogout ? () => keycloak.logout() : () => {}}
          signOutLabel={t("signOut")}
        >
          {extraItems}
        </Profile>
      </MastheadContent>
    </Masthead>
  )
}

const ManageAccountItem = ({ keycloak }: { keycloak: Keycloak }) => {
  const { t } = useTranslation()
  return (
    <DropdownMenuItem onSelect={() => keycloak.accountManagement()}>
      {t("manageAccount")}
    </DropdownMenuItem>
  )
}

export default KeycloakMasthead
