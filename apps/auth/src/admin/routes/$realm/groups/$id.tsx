// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { useFetch } from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { Sheet as UISheet, SheetContent as UISheetContent } from "@metronome/ui/components/sheet";
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { CaretDoubleLeft as AngleDoubleLeftIcon, TreeStructure as TreeIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { PermissionsTab } from "../../../components/permission-tab/permission-tab";
import { ViewHeader } from "../../../components/view-header/view-header";
import { useAccess } from "../../../context/access/access";
import { useRealm } from "../../../context/realm-context/realm-context";
import { AdminEvents } from "../../../components/events/admin-events";
import helpUrls from "../../../help-urls";
import useIsFeatureEnabled, { Feature } from "../../../utils/use-is-feature-enabled";
import useToggle from "../../../utils/use-toggle";
import { GroupAttributes } from "../../../components/groups/group-attributes";
import { GroupRoleMapping } from "../../../components/groups/group-role-mapping";
import { GroupTable } from "../../../components/groups/group-table";
import { GroupsModal } from "../../../components/groups/groups-modal";
import { Members } from "../../../components/groups/members";
import { useSubGroups } from "../../../components/groups/sub-groups-context";
import { DeleteGroup } from "../../../components/groups/components/delete-group";
import { GroupTree } from "../../../components/groups/components/group-tree";
import { getId, getLastId } from "../../../components/groups/groupIdUtils";
import { toGroups } from "../../../lib/groups";
import { GroupResourceContext } from "../../../context/group-resource/group-resource-context";
import { Tabs, Tab, TabTitleText } from "../../../../shared/pf-compat"

const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;

const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
const Drawer = ({ isExpanded, onExpand, children, ...props }: any) => (
  <UISheet open={isExpanded} {...props}>{children}</UISheet>
);
const DrawerContent = ({ panelContent, children, ...props }: any) => (
  <div className="relative" {...props}>{children}{panelContent}</div>
);
const DrawerContentBody = ({ children, className, ...props }: any) => (
  <div className={cn("flex-1", className)} {...props}>{children}</div>
);
const DrawerHead = ({ children, className, ...props }: any) => (
  <div className={cn("border-b p-3", className)} {...props}>{children}</div>
);
const DrawerPanelContent = ({ children, ...props }: any) => (
  <UISheetContent {...props}>{children}</UISheetContent>
);
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const PageSectionVariants = {
  default: "default",
  light: "light",
  dark: "dark",
  darker: "darker",
} as const;
const Tooltip = ({ content, children, ...props }: any) => <>{children}</>;

function GroupsSection({ orgId }: { orgId?: string } = {}) {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const { subGroups, setSubGroups, currentGroup } = useSubGroups();
  const { realm } = useRealm();

  const [rename, setRename] = useState<GroupRepresentation>();
  const [deleteOpen, toggleDeleteOpen] = useToggle();

  const navigate = useNavigate();
  const location = useLocation();
  const id = getLastId(location.pathname);

  const [open, toggle] = useToggle(true);
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const { hasAccess, hasSomeAccess } = useAccess();
  const isFeatureEnabled = useIsFeatureEnabled();
  const groupResource = orgId
    ? adminClient.organizations.groups(orgId)
    : adminClient.groups;
  const isOrganization = groupResource.isOrgGroups();
  const canViewPermissions =
    isFeatureEnabled(Feature.AdminFineGrainedAuthz) &&
    hasAccess("manage-authorization", "manage-users", "manage-clients");
  const canManageGroup =
    hasAccess("manage-users") || currentGroup()?.access?.manage || false;
  const canViewRoles = hasSomeAccess("view-users", "manage-users");
  const canViewDetails =
    hasAccess("query-groups", "view-users") ||
    hasAccess("manage-users", "query-groups");
  const canViewMembers =
    hasAccess("view-users") ||
    currentGroup()?.access?.viewMembers ||
    currentGroup()?.access?.manageMembers;

  const [activeEventsTab, setActiveEventsTab] = useState("adminEvents");

  useFetch(
    async () => {
      const ids = getId(location.pathname);
      const isNavigationStateInValid = ids && ids.length > subGroups.length;

      if (isNavigationStateInValid) {
        const groups: GroupRepresentation[] = [];
        for (const i of ids!) {
          let group = undefined;
          if (i !== "search") {
            group = await groupResource.findOne({ id: i });
          } else {
            group = { name: t("searchGroups"), id: "search" };
          }
          if (group) {
            groups.push(group);
          } else {
            throw new Error(t("notFound"));
          }
        }
        return groups;
      }
      return [];
    },
    (groups: GroupRepresentation[]) => {
      if (groups.length) setSubGroups(groups);
    },
    [id, orgId],
  );

  return (
    <GroupResourceContext value={groupResource}>
      <DeleteGroup
        show={deleteOpen}
        toggleDialog={toggleDeleteOpen}
        selectedRows={[currentGroup()!]}
        refresh={() => {
          navigate(toGroups({ realm, orgId }));
          refresh();
        }}
      />
      {rename && (
        <GroupsModal
          id={id}
          rename={rename}
          refresh={(group) => {
            refresh();
            setSubGroups([...subGroups.slice(0, subGroups.length - 1), group!]);
          }}
          handleModalToggle={() => setRename(undefined)}
        />
      )}
      <PageSection
        variant={PageSectionVariants.light}
        className="pf-v5-u-p-0 keycloak-admin--groups__section"
      >
        <Drawer isInline isExpanded={open} key={key} position="left">
          <DrawerContent
            panelContent={
              <DrawerPanelContent isResizable>
                <DrawerHead>
                  <GroupTree
                    refresh={refresh}
                    canViewDetails={canViewDetails}
                  />
                </DrawerHead>
              </DrawerPanelContent>
            }
          >
            <DrawerContentBody>
              <Tooltip content={open ? t("hide") : t("show")}>
                <Button
                  aria-label={open ? t("hide") : t("show")}
                  variant="plain"
                  icon={open ? <AngleDoubleLeftIcon /> : <TreeIcon />}
                  onClick={toggle}
                />
              </Tooltip>
              <ViewHeader
                titleKey={!id ? "groups" : currentGroup()?.name!}
                subKey={
                  !id
                    ? isOrganization
                      ? "orgGroupsDescription"
                      : "groupsDescription"
                    : ""
                }
                helpUrl={
                  !id
                    ? isOrganization
                      ? helpUrls.orgGroupsUrl
                      : helpUrls.groupsUrl
                    : ""
                }
                divider={!id}
                actionDropdownTitle={isOrganization ? "groupAction" : "action"}
                dropdownItems={
                  id && canManageGroup
                    ? [
                        <DropdownItem
                          data-testid="renameGroupAction"
                          key="renameGroup"
                          onClick={() => setRename(currentGroup())}
                        >
                          {t("edit")}
                        </DropdownItem>,
                        <DropdownItem
                          data-testid="deleteGroup"
                          key="deleteGroup"
                          onClick={toggleDeleteOpen}
                        >
                          {t("deleteGroup")}
                        </DropdownItem>,
                      ]
                    : undefined
                }
              />
              <PageSection className="pf-v5-u-pt-0">
                {currentGroup()?.description}
              </PageSection>
              {subGroups.length > 0 && (
                <Tabs
                  inset={{
                    default: "insetNone",
                    md: "insetSm",
                    xl: "insetLg",
                    "2xl": "inset2xl",
                  }}
                  activeKey={activeTab}
                  onSelect={(_, key) => setActiveTab(key as number)}
                  isBox
                  mountOnEnter
                  unmountOnExit
                >
                  <Tab
                    data-testid="groups"
                    eventKey={0}
                    title={<TabTitleText>{t("childGroups")}</TabTitleText>}
                  >
                    <GroupTable refresh={refresh} />
                  </Tab>
                  {canViewMembers && (
                    <Tab
                      data-testid="members"
                      eventKey={1}
                      title={<TabTitleText>{t("members")}</TabTitleText>}
                    >
                      <Members />
                    </Tab>
                  )}
                  <Tab
                    data-testid="attributesTab"
                    eventKey={2}
                    title={<TabTitleText>{t("attributes")}</TabTitleText>}
                  >
                    <GroupAttributes />
                  </Tab>
                  {!isOrganization && canViewRoles && (
                    <Tab
                      eventKey={3}
                      data-testid="role-mapping-tab"
                      title={<TabTitleText>{t("roleMapping")}</TabTitleText>}
                    >
                      <GroupRoleMapping
                        id={id!}
                        name={currentGroup()?.name!}
                        canManageGroup={canManageGroup}
                      />
                    </Tab>
                  )}
                  {!isOrganization && canViewPermissions && (
                    <Tab
                      eventKey={4}
                      data-testid="permissionsTab"
                      title={<TabTitleText>{t("permissions")}</TabTitleText>}
                    >
                      <PermissionsTab id={id} type="groups" />
                    </Tab>
                  )}
                  {hasAccess("view-events") && (
                    <Tab
                      eventKey={5}
                      data-testid="admin-events-tab"
                      title={<TabTitleText>{t("adminEvents")}</TabTitleText>}
                    >
                      <Tabs
                        activeKey={activeEventsTab}
                        onSelect={(_, key) => setActiveEventsTab(key as string)}
                      >
                        <Tab
                          eventKey="adminEvents"
                          title={
                            <TabTitleText>{t("adminEvents")}</TabTitleText>
                          }
                        >
                          <AdminEvents
                            resourcePath={
                              isOrganization
                                ? `organizations/${orgId}/groups/${id}`
                                : `groups/${id}`
                            }
                          />
                        </Tab>
                        <Tab
                          eventKey="membershipEvents"
                          title={
                            <TabTitleText>{t("membershipEvents")}</TabTitleText>
                          }
                        >
                          <AdminEvents
                            resourcePath={
                              isOrganization
                                ? `organizations/${orgId}/groups/${id}/members/*`
                                : `users/*/groups/${id}`
                            }
                          />
                        </Tab>
                        <Tab
                          eventKey="childGroupEvents"
                          title={
                            <TabTitleText>{t("childGroupEvents")}</TabTitleText>
                          }
                        >
                          <AdminEvents
                            resourcePath={
                              isOrganization
                                ? `organizations/${orgId}/groups/${id}/children`
                                : `groups/${id}/children`
                            }
                          />
                        </Tab>
                      </Tabs>
                    </Tab>
                  )}
                </Tabs>
              )}
              {subGroups.length === 0 && <GroupTable refresh={refresh} />}
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </GroupResourceContext>
  );
}

export const Route = createFileRoute("/$realm/groups/$id")({
  component: GroupsSection,
})
