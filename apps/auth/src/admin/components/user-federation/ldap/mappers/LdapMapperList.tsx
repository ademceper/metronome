/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/ldap/mappers/LdapMapperList.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import {
  Action,
  KeycloakDataTable,
  ListEmptyState,
  useAlerts,
  useFetch,
} from "../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, To, useNavigate, useParams } from "react-router-dom";
import { useAdminClient } from "../../../../admin-client";
import { useConfirmDialog } from "../../../confirm-dialog/ConfirmDialog";
import useLocaleSort, { mapByKey } from "../../../../utils/useLocaleSort";


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
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

export type LdapMapperListProps = {
  toCreate: To;
  toDetail: (mapperId: string) => To;
};

type MapperLinkProps = ComponentRepresentation & {
  toDetail: (mapperId: string) => To;
};

const MapperLink = ({ toDetail, ...mapper }: MapperLinkProps) => (
  <Link to={toDetail(mapper.id!)}>{mapper.name}</Link>
);

export const LdapMapperList = ({ toCreate, toDetail }: LdapMapperListProps) => {
  const { adminClient } = useAdminClient();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [mappers, setMappers] = useState<ComponentRepresentation[]>([]);
  const localeSort = useLocaleSort();

  const { id } = useParams<{ id: string }>();

  const [selectedMapper, setSelectedMapper] =
    useState<ComponentRepresentation>();

  useFetch(
    () =>
      adminClient.components.find({
        parent: id,
        type: "org.keycloak.storage.ldap.mappers.LDAPStorageMapper",
      }),
    (mapper) => {
      setMappers(
        localeSort(
          mapper.map((mapper) => ({
            ...mapper,
            name: mapper.name,
            type: mapper.providerId,
          })),
          mapByKey("name"),
        ),
      );
    },
    [key],
  );

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteMappingTitle", { mapperId: selectedMapper?.id }),
    messageKey: "deleteMappingConfirm",
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.components.del({
          id: selectedMapper!.id!,
        });
        refresh();
        addAlert(t("mappingDeletedSuccess"), AlertVariant.success);
        setSelectedMapper(undefined);
      } catch (error) {
        addError("mappingDeletedError", error);
      }
    },
  });

  return (
    <>
      <DeleteConfirm />
      <KeycloakDataTable
        key={key}
        loader={mappers}
        ariaLabelKey="ldapMappersList"
        searchPlaceholderKey="searchForMapper"
        toolbarItem={
          <ToolbarItem>
            <Button
              data-testid="add-mapper-btn"
              variant="primary"
              component={(props) => <Link {...props} to={toCreate} />}
            >
              {t("addMapper")}
            </Button>
          </ToolbarItem>
        }
        actions={[
          {
            title: t("delete"),
            onRowClick: (mapper) => {
              setSelectedMapper(mapper);
              toggleDeleteDialog();
            },
          } as Action<ComponentRepresentation>,
        ]}
        columns={[
          {
            name: "name",
            cellRenderer: (row) => <MapperLink {...row} toDetail={toDetail} />,
          },
          {
            name: "type",
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyMappers")}
            instructions={t("emptyMappersInstructions")}
            primaryActionText={t("emptyPrimaryAction")}
            onPrimaryAction={() => navigate(toCreate)}
          />
        }
      />
    </>
  );
};
