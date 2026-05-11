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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@metronome/ui/components/sidebar";
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
import { label, useEnvironment } from "../shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useAccess } from "./context/access/Access";
import { useRealm } from "./context/realm-context/RealmContext";
import { useServerInfo } from "./context/server-info/ServerInfoProvider";
import { useWhoAmI } from "./context/whoami/WhoAmI";
import { Environment } from "./environment";
import { toPage } from "./page/routes";
import { routes } from "./routes";
import useIsFeatureEnabled, { Feature } from "./utils/useIsFeatureEnabled";

type LeftNavProps = {
  title: string;
  path: string;
  icon: React.ReactNode;
  id?: string;
};

const LeftNav = ({ title, path, icon, id }: LeftNavProps) => {
  const { t } = useTranslation();
  const { hasAccess } = useAccess();
  const { realm } = useRealm();
  const encodedRealm = encodeURIComponent(realm);
  const route = routes.find(
    (route) =>
      route.path.replace(/\/:.+?(\?|(?:(?!\/).)*|$)/g, "") === (id || path),
  );

  const accessAllowed =
    route &&
    (route.handle.access instanceof Array
      ? hasAccess(...route.handle.access)
      : hasAccess(route.handle.access));

  if (!accessAllowed) {
    return null;
  }

  const name = "nav-item" + path.replace("/", "-");
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={t(title)}>
        <NavLink id={name} data-testid={name} to={`/${encodedRealm}${path}`}>
          {icon}
          <span>{t(title)}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
                  />
                )}
              <LeftNav title="clients" path="/clients" icon={<CubeIcon />} />
              <LeftNav
                title="clientScopes"
                path="/client-scopes"
                icon={<StackIcon />}
              />
              <LeftNav
                title="realmRoles"
                path="/roles"
                icon={<IdentificationCardIcon />}
              />
              <LeftNav title="users" path="/users" icon={<UsersIcon />} />
              <LeftNav
                title="groups"
                path="/groups"
                icon={<UsersThreeIcon />}
              />
              <LeftNav
                title="sessions"
                path="/sessions"
                icon={<ClockClockwiseIcon />}
              />
              <LeftNav
                title="events"
                path="/events"
                icon={<ListBulletsIcon />}
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
              />
              <LeftNav
                title="authentication"
                path="/authentication"
                icon={<KeyIcon />}
              />
              {isFeatureEnabled(Feature.AdminFineGrainedAuthzV2) &&
                realmRepresentation?.adminPermissionsEnabled && (
                  <LeftNav
                    title="permissions"
                    path="/permissions"
                    icon={<ShieldCheckIcon />}
                  />
                )}
              <LeftNav
                title="identityProviders"
                path="/identity-providers"
                icon={<SignInIcon />}
              />
              <LeftNav
                title="userFederation"
                path="/user-federation"
                icon={<UserGearIcon />}
              />
              {showWorkflows && (
                <LeftNav
                  title="workflows"
                  path="/workflows"
                  icon={<FlowArrowIcon />}
                />
              )}
              {isFeatureEnabled(Feature.DeclarativeUI) &&
                pages?.map((p) => (
                  <LeftNav
                    key={p.id}
                    title={p.id}
                    path={toPage({ providerId: p.id }).pathname!}
                    id="/page-section"
                    icon={<ListBulletsIcon />}
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
