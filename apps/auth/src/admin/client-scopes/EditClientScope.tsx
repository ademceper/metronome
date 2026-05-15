/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/client-scopes/EditClientScope.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import ClientScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientScopeRepresentation";
import type ProtocolMapperRepresentation from "@keycloak/keycloak-admin-client/lib/defs/protocolMapperRepresentation";
import type { RoleMappingPayload } from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import type { ProtocolMapperTypeRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/serverInfoRepesentation";
import {
  KeycloakSpinner,
  useAlerts,
  useFetch,
  useHelp,
} from "../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../admin-client";
import {
  AllClientScopes,
  ClientScope,
  ClientScopeDefaultOptionalType,
  changeScope,
} from "../components/client-scope/ClientScopeTypes";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { RoleMapping, Row } from "../components/role-mapping/RoleMapping";
import {
  RoutableTabs,
  useRoutableTab,
} from "../components/routable-tabs/RoutableTabs";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useRealm } from "../context/realm-context/RealmContext";
import { convertFormValuesToObject } from "../util";
import { useParams } from "../utils/useParams";
import { MapperList } from "./details/MapperList";
import { ScopeForm } from "./details/ScopeForm";
import { ClientScopeParams, toClientScope } from "../lib/client-scopes";
import { toClientScopes } from "../lib/client-scopes";
import { toMapper } from "../lib/client-scopes";
import { useAccess } from "../context/access/Access";
import { AdminEvents } from "../events/AdminEvents";
import { Tab, TabTitleText } from "../../shared/pf-compat"


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
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

export default function EditClientScope() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { realm, realmRepresentation } = useRealm();
  const { id } = useParams<ClientScopeParams>();
  const { addAlert, addError } = useAlerts();
  const { enabled } = useHelp();
  const [clientScope, setClientScope] =
    useState<ClientScopeDefaultOptionalType>();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const { hasAccess } = useAccess();

  useFetch(
    async () => {
      const clientScope = await adminClient.clientScopes.findOne({ id });

      if (!clientScope) {
        throw new Error(t("notFound"));
      }

      return {
        ...clientScope,
        type: await determineScopeType(clientScope),
      };
    },
    (clientScope) => {
      setClientScope(clientScope);
    },
    [key, id],
  );

  async function determineScopeType(clientScope: ClientScopeRepresentation) {
    const defaultScopes =
      await adminClient.clientScopes.listDefaultClientScopes();
    const hasDefaultScope = defaultScopes.find(
      (defaultScope) => defaultScope.name === clientScope.name,
    );

    if (hasDefaultScope) {
      return ClientScope.default;
    }

    const optionalScopes =
      await adminClient.clientScopes.listDefaultOptionalClientScopes();
    const hasOptionalScope = optionalScopes.find(
      (optionalScope) => optionalScope.name === clientScope.name,
    );

    return hasOptionalScope ? ClientScope.optional : AllClientScopes.none;
  }

  const settingsTab = useRoutableTab(
    toClientScope({ realm, id, tab: "settings" }),
  );
  const mappersTab = useRoutableTab(
    toClientScope({ realm, id, tab: "mappers" }),
  );
  const scopeTab = useRoutableTab(toClientScope({ realm, id, tab: "scope" }));
  const eventsTab = useRoutableTab(toClientScope({ realm, id, tab: "events" }));

  const onSubmit = async (formData: ClientScopeDefaultOptionalType) => {
    const clientScope = convertFormValuesToObject({
      ...formData,
      name: formData.name?.trim().replace(/ /g, "_"),
    });

    try {
      await adminClient.clientScopes.update({ id }, clientScope);
      await changeScope(adminClient, { ...clientScope, id }, clientScope.type);

      addAlert(t("updateSuccessClientScope"), AlertVariant.success);
    } catch (error) {
      addError("updateErrorClientScope", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteClientScope", {
      count: 1,
      name: clientScope?.name,
    }),
    messageKey: "deleteConfirmClientScopes",
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.clientScopes.del({ id });
        addAlert(t("deletedSuccessClientScope"), AlertVariant.success);
        navigate(toClientScopes({ realm }));
      } catch (error) {
        addError("deleteErrorClientScope", error);
      }
    },
  });

  const assignRoles = async (rows: Row[]) => {
    try {
      const realmRoles = rows
        .filter((row) => row.client === undefined)
        .map((row) => row.role as RoleMappingPayload)
        .flat();
      await adminClient.clientScopes.addRealmScopeMappings(
        {
          id,
        },
        realmRoles,
      );
      await Promise.all(
        rows
          .filter((row) => row.client !== undefined)
          .map((row) =>
            adminClient.clientScopes.addClientScopeMappings(
              {
                id,
                client: row.client!.id!,
              },
              [row.role as RoleMappingPayload],
            ),
          ),
      );
      addAlert(t("roleMappingUpdatedSuccess"), AlertVariant.success);
    } catch (error) {
      addError("roleMappingUpdatedError", error);
    }
  };

  const addMappers = async (
    mappers: ProtocolMapperTypeRepresentation | ProtocolMapperRepresentation[],
  ): Promise<void> => {
    if (!Array.isArray(mappers)) {
      const mapper = mappers as ProtocolMapperTypeRepresentation;
      navigate(
        toMapper({
          realm,
          id: clientScope!.id!,
          mapperId: mapper.id!,
          viewMode: "new",
        }),
      );
    } else {
      try {
        await adminClient.clientScopes.addMultipleProtocolMappers(
          { id: clientScope!.id! },
          mappers as ProtocolMapperRepresentation[],
        );
        refresh();
        addAlert(t("mappingCreatedSuccess"), AlertVariant.success);
      } catch (error) {
        addError("mappingCreatedError", error);
      }
    }
  };

  const onDelete = async (mapper: ProtocolMapperRepresentation) => {
    try {
      await adminClient.clientScopes.delProtocolMapper({
        id: clientScope!.id!,
        mapperId: mapper.id!,
      });
      addAlert(t("mappingDeletedSuccess"), AlertVariant.success);
      refresh();
    } catch (error) {
      addError("mappingDeletedError", error);
    }
    return true;
  };

  if (!clientScope) {
    return <KeycloakSpinner />;
  }

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={clientScope.name!}
        dropdownItems={[
          <DropdownItem key="delete" onClick={toggleDeleteDialog}>
            {t("delete")}
          </DropdownItem>,
        ]}
        badges={[{ text: clientScope.protocol }]}
        divider={false}
      />

      <PageSection variant="light" className="pf-v5-u-p-0">
        <RoutableTabs isBox mountOnEnter unmountOnExit>
          <Tab
            id="settings"
            data-testid="settings"
            title={<TabTitleText>{t("settings")}</TabTitleText>}
            {...settingsTab}
          >
            <PageSection variant="light">
              <ScopeForm save={onSubmit} clientScope={clientScope} />
            </PageSection>
          </Tab>
          <Tab
            id="mappers"
            data-testid="mappers"
            title={<TabTitleText>{t("mappers")}</TabTitleText>}
            {...mappersTab}
          >
            <MapperList
              model={clientScope}
              onAdd={addMappers}
              onDelete={onDelete}
              detailLink={(id) =>
                toMapper({
                  realm,
                  id: clientScope.id!,
                  mapperId: id!,
                  viewMode: "edit",
                })
              }
            />
          </Tab>
          <Tab
            id="scope"
            data-testid="scopeTab"
            title={<TabTitleText>{t("scope")}</TabTitleText>}
            {...scopeTab}
          >
            {enabled && (
              <PageSection>
                <Alert
                  variant="info"
                  isInline
                  title={t("clientScopesRolesScope")}
                  component="h2"
                />
              </PageSection>
            )}
            <RoleMapping
              id={clientScope.id!}
              name={clientScope.name!}
              type="clientScopes"
              save={assignRoles}
            />
          </Tab>
          {realmRepresentation?.adminEventsEnabled &&
            hasAccess("view-events") && (
              <Tab
                data-testid="admin-events-tab"
                title={<TabTitleText>{t("adminEvents")}</TabTitleText>}
                {...eventsTab}
              >
                <AdminEvents resourcePath={`*client-scopes/${id}`} />
              </Tab>
            )}
        </RoutableTabs>
      </PageSection>
    </>
  );
}
