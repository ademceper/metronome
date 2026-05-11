import { Profile } from "@metronome/auth"
import { cn } from "@metronome/ui/lib/utils"
import { useTranslation } from "react-i18next"
import { useEnvironment } from "../../shared/keycloak-ui-shared"
import { AccountEnvironment } from ".."

const UserMenu = () => {
  const { keycloak } = useEnvironment<AccountEnvironment>()
  const tokenParsed = (keycloak?.tokenParsed ?? {}) as {
    name?: string
    preferred_username?: string
    email?: string
    picture?: string
  }
  const { t } = useTranslation()

  return (
    <Profile
      name={tokenParsed.name || tokenParsed.preferred_username}
      email={tokenParsed.email}
      avatarUrl={tokenParsed.picture}
      onSignOut={() => keycloak?.logout()}
      signOutLabel={t("signOut")}
    />
  )
}

export const Header = ({ className }: { className?: string }) => {
  const { environment } = useEnvironment<AccountEnvironment>()
  const realm = environment?.realm

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-background/95 backdrop-blur",
        className,
      )}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-10 border-b px-4">
        <a
          href={environment?.baseUrl}
          className="text-2xl leading-none tracking-widest"
          style={{ fontFamily: '"Climate Crisis", sans-serif' }}
          data-testid="page-header"
        >
          {realm}
        </a>
        <UserMenu />
      </div>
    </header>
  )
}
