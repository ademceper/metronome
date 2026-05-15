// @ts-nocheck
import { AppSidebar, type SidebarNavGroup } from "@metronome/ui/blocks/layout/app-sidebar"
import {
  BuildingsIcon,
  ClockClockwiseIcon,
  CubeIcon,
  DatabaseIcon,
  FlowArrowIcon,
  GearIcon,
  IdentificationCardIcon,
  KeyIcon,
  ListBulletsIcon,
  ShieldCheckIcon,
  SignInIcon,
  StackIcon,
  UserGearIcon,
  UsersIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom"
import { label, useEnvironment } from "../../shared/keycloak-ui-shared"
import { useAccess } from "../context/access/Access"
import { useRealm } from "../context/realm-context/RealmContext"
import { useServerInfo } from "../context/server-info/ServerInfoProvider"
import { Environment } from "../environment"
import { toPage } from "../lib/page"
import useIsFeatureEnabled, { Feature } from "../utils/useIsFeatureEnabled"

// React-router-dom shim adapter: AppSidebar speaks `href`, NavLink expects `to`.
const Link = ({ href, children, ...rest }: { href: string; children: React.ReactNode } & Record<string, unknown>) => (
  <NavLink to={href} {...rest}>
    {children}
  </NavLink>
)

type Access = string | string[]

function isAllowed(hasAccess: (...types: string[]) => boolean, access: Access | undefined): boolean {
  if (!access) return true
  return Array.isArray(access) ? hasAccess(...access) : hasAccess(access)
}

export const PageNav = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation()
  const { environment } = useEnvironment<Environment>()
  const { hasAccess, hasSomeAccess } = useAccess()
  const { componentTypes } = useServerInfo()
  const isFeatureEnabled = useIsFeatureEnabled()
  const pages = componentTypes?.["org.keycloak.services.ui.extend.UiPageProvider"]
  const { realm, realmRepresentation } = useRealm()

  const showManage = hasSomeAccess(
    "view-realm",
    "query-groups",
    "query-users",
    "query-clients",
    "view-events",
  )
  const showConfigure = hasSomeAccess(
    "view-realm",
    "query-clients",
    "view-identity-providers",
  )
  const showWorkflows = hasAccess("manage-realm") && isFeatureEnabled(Feature.Workflows)
  const showManageRealm = environment.masterRealm === environment.realm
  const encodedRealm = encodeURIComponent(realm)
  const realmDisplayName = label(t, realmRepresentation?.displayName, realm)

  // Build the nav groups. Items are pre-filtered by access here so the block
  // stays purely presentational.
  const groups = useMemo<SidebarNavGroup[]>(() => {
    const realmPath = `/${encodedRealm}`
    const item = (def: {
      title: string
      path: string
      icon: React.ReactNode
      access?: Access
      items?: { title: string; path: string }[]
      testId?: string
    }) => {
      if (!isAllowed(hasAccess, def.access)) return null
      return {
        title: t(def.title),
        href: `${realmPath}${def.path}`,
        icon: def.icon,
        testId: def.testId ?? `nav-item${def.path.replace("/", "-")}`,
        items: def.items?.map((sub) => ({
          title: t(sub.title),
          href: `${realmPath}${def.path}/${sub.path}`,
        })),
      }
    }

    const out: SidebarNavGroup[] = []

    if (showManageRealm) {
      const r = item({
        title: "manageRealms",
        path: "/realms",
        icon: <DatabaseIcon />,
        access: "anyone",
      })
      if (r) out.push({ items: [r] })
    }

    if (showManage) {
      const manage = [
        isFeatureEnabled(Feature.Organizations) && realmRepresentation?.organizationsEnabled
          ? item({
              title: "organizations",
              path: "/organizations",
              icon: <BuildingsIcon />,
              access: "query-groups",
            })
          : null,
        item({
          title: "clients",
          path: "/clients",
          icon: <CubeIcon />,
          access: "query-clients",
          items: [
            { title: "clientList", path: "list" },
            { title: "initialAccessToken", path: "initial-access-token" },
            { title: "clientRegistration", path: "client-registration" },
          ],
        }),
        item({
          title: "clientScopes",
          path: "/client-scopes",
          icon: <StackIcon />,
          access: "view-clients",
        }),
        item({
          title: "realmRoles",
          path: "/roles",
          icon: <IdentificationCardIcon />,
          access: "view-realm",
        }),
        item({
          title: "users",
          path: "/users",
          icon: <UsersIcon />,
          access: "query-users",
        }),
        item({
          title: "groups",
          path: "/groups",
          icon: <UsersThreeIcon />,
          access: "query-groups",
        }),
        item({
          title: "sessions",
          path: "/sessions",
          icon: <ClockClockwiseIcon />,
          access: ["view-realm", "view-clients", "view-users"],
        }),
        item({
          title: "events",
          path: "/events",
          icon: <ListBulletsIcon />,
          access: "view-events",
          items: [
            { title: "userEvents", path: "user-events" },
            { title: "adminEvents", path: "admin-events" },
          ],
        }),
      ].filter(Boolean)
      if (manage.length) out.push({ label: t("manage"), items: manage as any })
    }

    if (showConfigure) {
      const configure = [
        item({
          title: "realmSettings",
          path: "/realm-settings",
          icon: <GearIcon />,
          access: "view-realm",
          items: [
            { title: "general", path: "general" },
            { title: "login", path: "login" },
            { title: "email", path: "email" },
            { title: "themes", path: "themes" },
            { title: "keys", path: "keys" },
            { title: "events", path: "events" },
            { title: "localization", path: "localization" },
            { title: "securityDefences", path: "security-defenses" },
            { title: "sessions", path: "sessions" },
            { title: "tokens", path: "tokens" },
            { title: "clientPolicies", path: "client-policies" },
            { title: "userProfile", path: "user-profile" },
          ],
        }),
        item({
          title: "authentication",
          path: "/authentication",
          icon: <KeyIcon />,
          access: ["view-realm", "view-identity-providers", "view-clients"],
          items: [
            { title: "flows", path: "flows" },
            { title: "requiredActions", path: "required-actions" },
            { title: "policies", path: "policies" },
          ],
        }),
        isFeatureEnabled(Feature.AdminFineGrainedAuthzV2) && realmRepresentation?.adminPermissionsEnabled
          ? item({
              title: "permissions",
              path: "/permissions",
              icon: <ShieldCheckIcon />,
              access: ["view-realm", "view-clients", "view-users"],
            })
          : null,
        item({
          title: "identityProviders",
          path: "/identity-providers",
          icon: <SignInIcon />,
          access: "view-identity-providers",
        }),
        item({
          title: "userFederation",
          path: "/user-federation",
          icon: <UserGearIcon />,
          access: "view-realm",
        }),
        showWorkflows
          ? item({
              title: "workflows",
              path: "/workflows",
              icon: <FlowArrowIcon />,
              access: "manage-realm",
            })
          : null,
        ...(isFeatureEnabled(Feature.DeclarativeUI) && pages
          ? pages.map((p: { id: string }) =>
              item({
                title: p.id,
                path: toPage({ providerId: p.id }).pathname!.replace(`/${encodedRealm}`, ""),
                icon: <ListBulletsIcon />,
                access: "view-realm",
              })
            )
          : []),
      ].filter(Boolean)
      if (configure.length) out.push({ label: t("configure"), items: configure as any })
    }

    return out
  }, [
    encodedRealm,
    t,
    hasAccess,
    isFeatureEnabled,
    pages,
    realmRepresentation,
    showConfigure,
    showManage,
    showManageRealm,
    showWorkflows,
  ])

  return (
    <AppSidebar
      brand={{
        name: realmDisplayName,
        description: t("currentRealm"),
        icon: <DatabaseIcon className="size-4" />,
        href: `/${encodedRealm}`,
        testId: "currentRealm",
      }}
      groups={groups}
      Link={Link}
    >
      {children}
    </AppSidebar>
  )
}
