/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/PageNav.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  Avatar,
  AvatarFallback,
} from "@metronome/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@metronome/ui/components/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@metronome/ui/components/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@metronome/ui/components/sidebar";
import { CaretRightIcon } from "@phosphor-icons/react";
import {
  BuildingsIcon,
  CaretUpDownIcon,
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
  SignOutIcon,
  StackIcon,
  UserGearIcon,
  UsersIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { label, useEnvironment } from "../../shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useAccess } from "../context/access/Access";
import { useRealm } from "../context/realm-context/RealmContext";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { useWhoAmI } from "../context/whoami/WhoAmI";
import { Environment } from "../environment";
import { toPage } from "../lib/page";
import useIsFeatureEnabled, { Feature } from "../utils/useIsFeatureEnabled";

type Access = string | string[];

type SubNavItem = {
  title: string;
  path: string;
};

type LeftNavProps = {
  title: string;
  path: string;
  icon: React.ReactNode;
  access: Access;
  /** Sub-items rendered as a collapsible submenu under the main item.
   *  The parent itself stays clickable (navigates to `path`); the chevron
   *  trigger expands the children list. Each child's path is appended to
   *  the parent path verbatim (e.g. parent "/clients" + child "list" →
   *  "/clients/list"). */
  items?: SubNavItem[];
};

const LeftNav = ({ title, path, icon, access, items }: LeftNavProps) => {
  const { t } = useTranslation();
  const { hasAccess } = useAccess();
  const { realm } = useRealm();
  const encodedRealm = encodeURIComponent(realm);

  const accessAllowed = Array.isArray(access)
    ? hasAccess(...access)
    : hasAccess(access);

  if (!accessAllowed) {
    return null;
  }

  const name = "nav-item" + path.replace("/", "-");
  const basePath = `/${encodedRealm}${path}`;

  if (!items || items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={t(title)}>
          <NavLink id={name} data-testid={name} to={basePath}>
            {icon}
            <span>{t(title)}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible asChild defaultOpen={false} className="group/collapsible">
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={t(title)}>
          <NavLink id={name} data-testid={name} to={basePath}>
            {icon}
            <span>{t(title)}</span>
          </NavLink>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            aria-label={t("expand", "Expand")}
            className="absolute end-1 top-1/2 -translate-y-1/2 inline-flex size-6 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-transform group-data-[state=open]/collapsible:rotate-90"
          >
            <CaretRightIcon className="size-3.5" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((sub) => (
              <SidebarMenuSubItem key={sub.path}>
                <SidebarMenuSubButton asChild>
                  <NavLink to={`${basePath}/${sub.path}`}>
                    <span>{t(sub.title)}</span>
                  </NavLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const NavUser = () => {
  const { t } = useTranslation();
  const { keycloak } = useEnvironment<Environment>();
  const { whoAmI } = useWhoAmI();
  const { isMobile } = useSidebar();
  const displayName = whoAmI.displayName || whoAmI.userName || whoAmI.userId;
  const initials = (displayName || "?").slice(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
              </div>
              <CaretUpDownIcon className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="grid text-start text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => keycloak.logout()}>
              <SignOutIcon />
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export const PageNav = () => {
  const { t } = useTranslation();
  const { environment } = useEnvironment<Environment>();
  const { hasAccess, hasSomeAccess } = useAccess();
  const { componentTypes } = useServerInfo();
  const isFeatureEnabled = useIsFeatureEnabled();
  const pages =
    componentTypes?.["org.keycloak.services.ui.extend.UiPageProvider"];
  const { realm, realmRepresentation } = useRealm();

  const showManage = hasSomeAccess(
    "view-realm",
    "query-groups",
    "query-users",
    "query-clients",
    "view-events",
  );

  const showConfigure = hasSomeAccess(
    "view-realm",
    "query-clients",
    "view-identity-providers",
  );

  const showWorkflows =
    hasAccess("manage-realm") && isFeatureEnabled(Feature.Workflows);

  const showManageRealm = environment.masterRealm === environment.realm;
  const encodedRealm = encodeURIComponent(realm);
  const realmDisplayName = label(t, realmRepresentation?.displayName, realm);

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to={`/${encodedRealm}`} data-testid="currentRealm">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <DatabaseIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">
                    {realmDisplayName}
                  </span>
                  <span className="truncate text-xs">
                    {t("currentRealm")}
                  </span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {showManageRealm && (
          <SidebarGroup>
            <SidebarMenu>
              <LeftNav
                title={t("manageRealms")}
                path="/realms"
                icon={<DatabaseIcon />}
                access="anyone"
              />
            </SidebarMenu>
          </SidebarGroup>
        )}

        {showManage && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("manage")}</SidebarGroupLabel>
            <SidebarMenu>
              {isFeatureEnabled(Feature.Organizations) &&
                realmRepresentation?.organizationsEnabled && (
                  <LeftNav
                    title="organizations"
                    path="/organizations"
                    icon={<BuildingsIcon />}
                    access="query-groups"
                  />
                )}
              <LeftNav
                title="clients"
                path="/clients"
                icon={<CubeIcon />}
                access="query-clients"
                items={[
                  { title: "clientList", path: "list" },
                  { title: "initialAccessToken", path: "initial-access-token" },
                  { title: "clientRegistration", path: "client-registration" },
                ]}
              />
              <LeftNav
                title="clientScopes"
                path="/client-scopes"
                icon={<StackIcon />}
                access="view-clients"
              />
              <LeftNav
                title="realmRoles"
                path="/roles"
                icon={<IdentificationCardIcon />}
                access="view-realm"
              />
              <LeftNav
                title="users"
                path="/users"
                icon={<UsersIcon />}
                access="query-users"
              />
              <LeftNav
                title="groups"
                path="/groups"
                icon={<UsersThreeIcon />}
                access="query-groups"
              />
              <LeftNav
                title="sessions"
                path="/sessions"
                icon={<ClockClockwiseIcon />}
                access={["view-realm", "view-clients", "view-users"]}
              />
              <LeftNav
                title="events"
                path="/events"
                icon={<ListBulletsIcon />}
                access="view-events"
                items={[
                  { title: "userEvents", path: "user-events" },
                  { title: "adminEvents", path: "admin-events" },
                ]}
              />
            </SidebarMenu>
          </SidebarGroup>
        )}

        {showConfigure && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("configure")}</SidebarGroupLabel>
            <SidebarMenu>
              <LeftNav
                title="realmSettings"
                path="/realm-settings"
                icon={<GearIcon />}
                access="view-realm"
                items={[
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
                ]}
              />
              <LeftNav
                title="authentication"
                path="/authentication"
                icon={<KeyIcon />}
                access={["view-realm", "view-identity-providers", "view-clients"]}
                items={[
                  { title: "flows", path: "flows" },
                  { title: "requiredActions", path: "required-actions" },
                  { title: "policies", path: "policies" },
                ]}
              />
              {isFeatureEnabled(Feature.AdminFineGrainedAuthzV2) &&
                realmRepresentation?.adminPermissionsEnabled && (
                  <LeftNav
                    title="permissions"
                    path="/permissions"
                    icon={<ShieldCheckIcon />}
                    access={["view-realm", "view-clients", "view-users"]}
                  />
                )}
              <LeftNav
                title="identityProviders"
                path="/identity-providers"
                icon={<SignInIcon />}
                access="view-identity-providers"
              />
              <LeftNav
                title="userFederation"
                path="/user-federation"
                icon={<UserGearIcon />}
                access="view-realm"
              />
              {showWorkflows && (
                <LeftNav
                  title="workflows"
                  path="/workflows"
                  icon={<FlowArrowIcon />}
                  access="manage-realm"
                />
              )}
              {isFeatureEnabled(Feature.DeclarativeUI) &&
                pages?.map((p) => (
                  <LeftNav
                    key={p.id}
                    title={p.id}
                    path={toPage({ providerId: p.id }).pathname!}
                    icon={<ListBulletsIcon />}
                    access="view-realm"
                  />
                ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
