/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/IdentityProviders.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import {
  KeycloakDataTable,
  ListEmptyState,
  useAlerts,
  useFetch,
} from "../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { sortBy } from "lodash-es";
import { Bell as BellIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useAdminClient } from "../admin-client";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { ManageOrderDialog } from "../identity-providers/ManageOrderDialog";
import { toIdentityProvider } from "../identity-providers/routes/IdentityProvider";
import { useRealm } from "../context/realm-context/RealmContext";
import useToggle from "../utils/useToggle";
import { LinkIdentityProviderModal } from "./LinkIdentityProviderModal";
import { EditOrganizationParams } from "./routes/EditOrganization";


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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

type ShownOnLoginPageCheckProps = {
  row: IdentityProviderRepresentation;
  refresh: () => void;
};

const ShownOnLoginPageCheck = ({
  row,
  refresh,
}: ShownOnLoginPageCheckProps) => {
  const { adminClient } = useAdminClient();
  const { addAlert, addError } = useAlerts();
  const { t } = useTranslation();

  const toggle = async (value: boolean) => {
    try {
      await adminClient.identityProviders.update(
        { alias: row.alias! },
        {
          ...row,
          hideOnLogin: value,
        },
      );
      addAlert(t("linkUpdatedSuccessful"));

      refresh();
    } catch (error) {
      addError("linkUpdatedError", error);
    }
  };

  return (
    <Switch
      label={t("on")}
      labelOff={t("off")}
      isChecked={row.hideOnLogin}
      onChange={(_, value) => toggle(value)}
    />
  );
};

export const IdentityProviders = () => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const { id: orgId } = useParams<EditOrganizationParams>();
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [manageDisplayDialog, setManageDisplayDialog] = useState(false);
  const [hasProviders, setHasProviders] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<IdentityProviderRepresentation>();
  const [open, toggleOpen] = useToggle();

  useFetch(
    async () => adminClient.identityProviders.find({ max: 1 }),
    (providers) => {
      setHasProviders(providers.length === 1);
    },
    [],
  );

  const loader = async () => {
    const providers = await adminClient.organizations.listIdentityProviders({
      orgId: orgId!,
    });
    return sortBy(providers, "alias");
  };

  const [toggleUnlinkDialog, UnlinkConfirm] = useConfirmDialog({
    titleKey: "identityProviderUnlink",
    messageKey: "identityProviderUnlinkConfirm",
    continueButtonLabel: "unLinkIdentityProvider",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.organizations.unLinkIdp({
          orgId: orgId!,
          alias: selectedRow!.alias! as string,
        });
        setSelectedRow(undefined);
        addAlert(t("unLinkSuccessful"));
        refresh();
      } catch (error) {
        addError("unLinkError", error);
      }
    },
  });

  return (
    <>
      {manageDisplayDialog && (
        <ManageOrderDialog
          orgId={orgId!}
          onClose={() => {
            setManageDisplayDialog(false);
            refresh();
          }}
        />
      )}
      <PageSection variant="light">
        <UnlinkConfirm />
        {open && (
          <LinkIdentityProviderModal
            orgId={orgId!}
            identityProvider={selectedRow}
            onClose={() => {
              toggleOpen();
              refresh();
            }}
          />
        )}
        {!hasProviders ? (
          <ListEmptyState
            icon={BellIcon}
            message={t("noIdentityProvider")}
            instructions={t("noIdentityProviderInstructions")}
          />
        ) : (
          <KeycloakDataTable
            key={key}
            loader={loader}
            ariaLabelKey="identityProviders"
            searchPlaceholderKey="searchProvider"
            toolbarItem={
              <>
                <ToolbarItem>
                  <Button
                    onClick={() => {
                      setSelectedRow(undefined);
                      toggleOpen();
                    }}
                  >
                    {t("linkIdentityProvider")}
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    data-testid="manageDisplayOrder"
                    variant="link"
                    onClick={() => setManageDisplayDialog(true)}
                  >
                    {t("manageDisplayOrder")}
                  </Button>
                </ToolbarItem>
              </>
            }
            actions={[
              {
                title: t("edit"),
                onRowClick: (row) => {
                  setSelectedRow(row);
                  toggleOpen();
                },
              },
              {
                title: t("unLinkIdentityProvider"),
                onRowClick: (row) => {
                  setSelectedRow(row);
                  toggleUnlinkDialog();
                },
              },
            ]}
            columns={[
              {
                name: "alias",
                cellRenderer: (row) => (
                  <Link
                    to={toIdentityProvider({
                      realm,
                      providerId: row.providerId!,
                      alias: row.alias!,
                      tab: "settings",
                    })}
                  >
                    {row.alias}
                  </Link>
                ),
              },
              {
                name: "config['kc.org.domain']",
                displayKey: "domain",
              },
              {
                name: "providerId",
                displayKey: "providerDetails",
              },
              {
                name: "hideOnLogin",
                displayKey: "hideOnLoginPage",
                cellRenderer: (row) => (
                  <ShownOnLoginPageCheck row={row} refresh={refresh} />
                ),
              },
            ]}
            emptyState={
              <ListEmptyState
                message={t("emptyIdentityProviderLink")}
                instructions={t("emptyIdentityProviderLinkInstructions")}
                primaryActionText={t("linkIdentityProvider")}
                onPrimaryAction={toggleOpen}
              />
            }
          />
        )}
      </PageSection>
    </>
  );
};
