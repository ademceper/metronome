/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/UsersSection.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { ViewHeader } from "../view-header/view-header";
import { useRealm } from "../../context/realm-context/realm-context";
import helpUrls from "../../help-urls";
import { PermissionsTab } from "../permission-tab/permission-tab";
import { UserDataTable } from "../users/user-data-table";
import { toUsers, UserTab } from "../../lib/user";
import {
  RoutableTabs,
  useRoutableTab,
} from "../routable-tabs/routable-tabs";
import useIsFeatureEnabled, { Feature } from "../../utils/use-is-feature-enabled";
import { useAccess } from "../../context/access/access";
import { Tab, TabTitleText } from "../../../shared/pf-compat"


const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export default function UsersSection() {
  const { t } = useTranslation();
  const { realm: realmName } = useRealm();
  const { hasAccess } = useAccess();
  const isFeatureEnabled = useIsFeatureEnabled();

  const canViewPermissions =
    isFeatureEnabled(Feature.AdminFineGrainedAuthz) &&
    hasAccess("manage-authorization", "manage-users", "manage-clients");

  const useTab = (tab: UserTab) =>
    useRoutableTab(
      toUsers({
        realm: realmName,
        tab,
      }),
    );

  const listTab = useTab("list");
  const permissionsTab = useTab("permissions");

  return (
    <>
      <ViewHeader
        titleKey="titleUsers"
        subKey="usersExplain"
        helpUrl={helpUrls.usersUrl}
        divider={false}
      />
      <PageSection
        data-testid="users-page"
        variant="light"
        className="pf-v5-u-p-0"
      >
        <RoutableTabs
          data-testid="user-tabs"
          defaultLocation={toUsers({
            realm: realmName,
            tab: "list",
          })}
          isBox
          mountOnEnter
        >
          <Tab
            id="list"
            data-testid="listTab"
            title={<TabTitleText>{t("userList")}</TabTitleText>}
            {...listTab}
          >
            <UserDataTable />
          </Tab>
          {canViewPermissions && (
            <Tab
              id="permissions"
              data-testid="permissionsTab"
              title={<TabTitleText>{t("permissions")}</TabTitleText>}
              {...permissionsTab}
            >
              <PermissionsTab type="users" />
            </Tab>
          )}
        </RoutableTabs>
      </PageSection>
    </>
  );
}
