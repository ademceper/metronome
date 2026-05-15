/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/registration/ClientRegistrationList.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import {
  ListEmptyState,
  useAlerts,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { Action, KeycloakDataTable } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/RealmContext";
import useToggle from "../../utils/useToggle";
import { toRegistrationProvider } from "../paths/AddRegistrationProvider";
import { ClientRegistrationParams } from "../paths/ClientRegistration";
import { AddProviderDialog } from "./AddProviderDialog";


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

type ClientRegistrationListProps = {
  subType: "anonymous" | "authenticated";
};

const DetailLink = (comp: ComponentRepresentation) => {
  const { realm } = useRealm();
  const { subTab } = useParams<ClientRegistrationParams>();

  return (
    <Link
      key={comp.id}
      to={toRegistrationProvider({
        realm,
        subTab: subTab || "anonymous",
        providerId: comp.providerId!,
        id: comp.id,
      })}
    >
      {comp.name}
    </Link>
  );
};

export const ClientRegistrationList = ({
  subType,
}: ClientRegistrationListProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { subTab } = useParams<ClientRegistrationParams>();
  const navigate = useNavigate();

  const { addAlert, addError } = useAlerts();
  const { realm } = useRealm();
  const [policies, setPolicies] = useState<ComponentRepresentation[]>([]);
  const [selectedPolicy, setSelectedPolicy] =
    useState<ComponentRepresentation>();
  const [isAddDialogOpen, toggleAddDialog] = useToggle();

  useFetch(
    () =>
      adminClient.components.find({
        type: "org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy",
      }),
    (policies) => setPolicies(policies.filter((p) => p.subType === subType)),
    [selectedPolicy],
  );

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "clientRegisterPolicyDeleteConfirmTitle",
    messageKey: t("clientRegisterPolicyDeleteConfirm", {
      name: selectedPolicy?.name,
    }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.components.del({
          realm,
          id: selectedPolicy?.id!,
        });
        addAlert(t("clientRegisterPolicyDeleteSuccess"));
        setSelectedPolicy(undefined);
      } catch (error) {
        addError("clientRegisterPolicyDeleteError", error);
      }
    },
  });

  return (
    <>
      {isAddDialogOpen && (
        <AddProviderDialog
          onConfirm={(providerId) =>
            navigate(
              toRegistrationProvider({
                realm,
                subTab: subTab || "anonymous",
                providerId,
              }),
            )
          }
          toggleDialog={toggleAddDialog}
        />
      )}
      <DeleteConfirm />
      <KeycloakDataTable
        ariaLabelKey="clientRegistration"
        searchPlaceholderKey={t("searchClientRegistration")}
        data-testid={`clientRegistration-${subType}`}
        loader={policies}
        toolbarItem={
          <ToolbarItem>
            <Button
              data-testid={`createPolicy-${subType}`}
              onClick={toggleAddDialog}
            >
              {t("createPolicy")}
            </Button>
          </ToolbarItem>
        }
        actions={[
          {
            title: t("delete"),
            onRowClick: (policy) => {
              setSelectedPolicy(policy);
              toggleDeleteDialog();
            },
          } as Action<ComponentRepresentation>,
        ]}
        columns={[
          {
            name: "name",
            displayKey: "name",
            cellRenderer: DetailLink,
          },
          {
            name: "providerId",
            displayKey: "providerId",
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("noAccessPolicies")}
            instructions={t("noAccessPoliciesInstructions")}
            primaryActionText={t("createPolicy")}
            onPrimaryAction={toggleAddDialog}
          />
        }
      />
    </>
  );
};
