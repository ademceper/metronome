// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import {
  KeycloakSpinner,
  useAlerts,
  useFetch,
} from "../../../../../../../shared/keycloak-ui-shared";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMatch, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../../admin-client";
import { toClient } from "../../../../../../lib/clients";
import {
  ClientRoleParams,
  ClientRoleRoute,
  ClientRoleTab,
  toClientRole,
} from "../../../../../../lib/clients";
import { useConfirmDialog } from "../../../../../../components/confirm-dialog/confirm-dialog";
import {
  AttributeForm,
  AttributesForm,
} from "../../../../../../components/key-value-form/attribute-form";
import {
  KeyValueType,
  arrayToKeyValue,
  keyValueToArray,
} from "../../../../../../components/key-value-form/key-value-convert";
import { PermissionsTab } from "../../../../../../components/permission-tab/permission-tab";
import { RoleForm } from "../../../../../../components/role-form/role-form";
import { RoleMapping } from "../../../../../../components/role-mapping/role-mapping";
import {
  RoutableTabs,
  useRoutableTab,
} from "../../../../../../components/routable-tabs/routable-tabs";
import { ViewHeader } from "../../../../../../components/view-header/view-header";
import { useAccess } from "../../../../../../context/access/access";
import { useRealm } from "../../../../../../context/realm-context/realm-context";
import { AdminEvents } from "../../../../../../components/events/admin-events";
import useIsFeatureEnabled, { Feature } from "../../../../../../utils/use-is-feature-enabled";
import { useParams } from "../../../../../../utils/use-params";
import { UsersInRoleTab } from "../../../../../../components/realm-roles/users-in-role-tab";
import { RealmRoleRoute, RealmRoleTab, toRealmRole } from "../../../../../../lib/realm-roles";
import { toRealmRoles } from "../../../../../../lib/realm-roles";
import { Tab, TabTitleText } from "../../../../../../../shared/pf-compat"


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;

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

function RealmRoleTabs() {
  const { adminClient } = useAdminClient();

  const isFeatureEnabled = useIsFeatureEnabled();
  const { t } = useTranslation();
  const form = useForm<AttributeForm>({
    mode: "onChange",
  });
  const { control, reset, setValue } = form;
  const navigate = useNavigate();

  const { id, clientId } = useParams<ClientRoleParams>();
  const { realm: realmName, realmRepresentation: realm } = useRealm();
  const [key, setKey] = useState(0);
  const [attributes, setAttributes] = useState<KeyValueType[] | undefined>();

  const refresh = () => setKey(key + 1);

  const { addAlert, addError } = useAlerts();

  const { hasAccess } = useAccess();
  const canViewPermissionsTab = hasAccess(
    "query-clients",
    "manage-authorization",
  );

  const [canManageClientRole, setCanManageClientRole] = useState(false);

  const convert = (role: RoleRepresentation) => {
    const { attributes, ...rest } = role;
    return {
      attributes: arrayToKeyValue(attributes),
      ...rest,
    };
  };

  const roleName = useWatch({
    control,
    defaultValue: undefined,
    name: "name",
  });

  const composites = useWatch({
    control,
    defaultValue: false,
    name: "composite",
  });

  useFetch(
    async () => adminClient.roles.findOneById({ id }),
    (role) => {
      if (!role) {
        throw new Error(t("notFound"));
      }

      const convertedRole = convert(role);

      reset(convertedRole);
      setAttributes(convertedRole.attributes);
    },
    [key],
  );

  useFetch(
    async () => adminClient.clients.findOne({ id: clientId }),
    (client) => {
      if (clientId) setCanManageClientRole(client?.access?.manage as boolean);
    },
    [],
  );

  const onSubmit: SubmitHandler<AttributeForm> = async (formValues) => {
    try {
      const { attributes, ...rest } = formValues;
      const roleRepresentation: RoleRepresentation = rest;

      roleRepresentation.name = roleRepresentation.name?.trim();
      roleRepresentation.attributes = keyValueToArray(attributes);

      if (!clientId) {
        await adminClient.roles.updateById({ id }, roleRepresentation);
      } else {
        await adminClient.clients.updateRole(
          { id: clientId, roleName: formValues.name! },
          roleRepresentation,
        );
      }

      setAttributes(attributes);
      addAlert(t("roleSaveSuccess"), AlertVariant.success);
    } catch (error) {
      addError("roleSaveError", error);
    }
  };

  const realmRoleMatch = useMatch(RealmRoleRoute.path);
  const clientRoleMatch = useMatch(ClientRoleRoute.path);

  const toOverview = () => {
    if (realmRoleMatch) {
      return toRealmRoles({ realm: realmName });
    }

    if (clientRoleMatch) {
      return toClient({
        realm: realmName,
        clientId: clientRoleMatch.params.clientId!,
        tab: "roles",
      });
    }

    throw new Error("Roles overview route could not be determined.");
  };

  const toTab = (tab: RealmRoleTab | ClientRoleTab) => {
    if (realmRoleMatch) {
      return toRealmRole({
        realm: realmName,
        id,
        tab,
      });
    }

    if (clientRoleMatch) {
      return toClientRole({
        realm: realmName,
        id,
        clientId: clientRoleMatch.params.clientId!,
        tab: tab as ClientRoleTab,
      });
    }

    throw new Error("Route could not be determined.");
  };

  const detailsTab = useRoutableTab(toTab("details"));
  const associatedRolesTab = useRoutableTab(toTab("associated-roles"));
  const attributesTab = useRoutableTab(toTab("attributes"));
  const usersInRoleTab = useRoutableTab(toTab("users-in-role"));
  const permissionsTab = useRoutableTab(toTab("permissions"));
  const eventsTab = useRoutableTab(toTab("events"));

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "roleDeleteConfirm",
    messageKey: t("roleDeleteConfirmDialog", {
      selectedRoleName: roleName || t("createRole"),
    }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        if (!clientId) {
          await adminClient.roles.delById({ id });
        } else {
          await adminClient.clients.delRole({
            id: clientId,
            roleName: roleName!,
          });
        }
        addAlert(t("roleDeletedSuccess"), AlertVariant.success);
        navigate(toOverview());
      } catch (error) {
        addError("roleDeleteError", error);
      }
    },
  });

  const addComposites = async (composites: RoleRepresentation[]) => {
    try {
      await adminClient.roles.createComposite(
        { roleId: id, realm: realm!.realm },
        composites,
      );
      refresh();
      navigate(toTab("associated-roles"));
      addAlert(t("addAssociatedRolesSuccess"), AlertVariant.success);
    } catch (error) {
      addError("addAssociatedRolesError", error);
    }
  };

  const isDefaultRole = (name: string | undefined) =>
    realm?.defaultRole && realm.defaultRole!.name === name;

  if (!realm) {
    return <KeycloakSpinner />;
  }

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={roleName!}
        badges={[
          {
            id: "composite-role-badge",
            text: composites ? t("composite") : "",
            readonly: true,
          },
        ]}
        actionsDropdownId="roles-actions-dropdown"
        dropdownItems={[
          <DropdownItem
            key="delete-role"
            component="button"
            onClick={() => {
              toggleDeleteDialog();
            }}
          >
            {t("deleteRole")}
          </DropdownItem>,
        ]}
        divider={false}
      />
      <PageSection variant="light" className="pf-v5-u-p-0">
        <FormProvider {...form}>
          <RoutableTabs isBox mountOnEnter defaultLocation={toTab("details")}>
            <Tab
              title={<TabTitleText>{t("details")}</TabTitleText>}
              {...detailsTab}
            >
              <RoleForm
                form={form}
                onSubmit={onSubmit}
                role={clientRoleMatch ? "manage-clients" : "manage-realm"}
                cancelLink={
                  clientRoleMatch
                    ? toClient({ realm: realmName, clientId, tab: "roles" })
                    : toRealmRoles({ realm: realmName })
                }
                editMode
              />
            </Tab>
            <Tab
              data-testid="associatedRolesTab"
              title={<TabTitleText>{t("associatedRolesText")}</TabTitleText>}
              {...associatedRolesTab}
            >
              <RoleMapping
                name={roleName!}
                id={id}
                type="roles"
                isManager
                save={(rows) => addComposites(rows.map((r) => r.role))}
              />
            </Tab>
            {!isDefaultRole(roleName) && (
              <Tab
                data-testid="attributesTab"
                className="kc-attributes-tab"
                title={<TabTitleText>{t("attributes")}</TabTitleText>}
                {...attributesTab}
              >
                <AttributesForm
                  form={form}
                  save={onSubmit}
                  fineGrainedAccess={canManageClientRole}
                  reset={() =>
                    setValue("attributes", attributes, { shouldDirty: false })
                  }
                />
              </Tab>
            )}
            {!isDefaultRole(roleName) && (
              <Tab
                data-testid="usersInRoleTab"
                title={<TabTitleText>{t("usersInRole")}</TabTitleText>}
                {...usersInRoleTab}
              >
                <UsersInRoleTab data-cy="users-in-role-tab" />
              </Tab>
            )}
            {isFeatureEnabled(Feature.AdminFineGrainedAuthz) &&
              canViewPermissionsTab && (
                <Tab
                  title={<TabTitleText>{t("permissions")}</TabTitleText>}
                  {...permissionsTab}
                >
                  <PermissionsTab id={id} type="roles" />
                </Tab>
              )}
            {hasAccess("view-events") && (
              <Tab
                data-testid="admin-events-tab"
                title={<TabTitleText>{t("adminEvents")}</TabTitleText>}
                {...eventsTab}
              >
                <AdminEvents resourcePath={`roles-by-id/${id}`} />
              </Tab>
            )}
          </RoutableTabs>
        </FormProvider>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/clients/$clientId/roles/$id/$tab")({
  component: RealmRoleTabs,
})
