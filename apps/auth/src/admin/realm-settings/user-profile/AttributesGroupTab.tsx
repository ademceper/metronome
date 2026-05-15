/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/AttributesGroupTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { UserProfileGroup } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { ListEmptyState } from "../../../shared/keycloak-ui-shared";
import { Action, KeycloakDataTable } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/RealmContext";
import { toEditAttributesGroup } from "../../lib/realm-settings";
import { toNewAttributesGroup } from "../../lib/realm-settings";
import { useUserProfile } from "./UserProfileContext";
import useLocale from "../../utils/useLocale";
import { useAdminClient } from "../../admin-client";


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
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

type AttributesGroupTabProps = {
  setTableData: React.Dispatch<
    React.SetStateAction<Record<string, string>[] | undefined>
  >;
};

export const AttributesGroupTab = ({
  setTableData,
}: AttributesGroupTabProps) => {
  const { adminClient } = useAdminClient();
  const { config, save } = useUserProfile();
  const { t } = useTranslation();
  const combinedLocales = useLocale();
  const navigate = useNavigate();
  const { realm } = useRealm();
  const [key, setKey] = useState(0);
  const [groupToDelete, setGroupToDelete] = useState<UserProfileGroup>();

  // Refresh data in table when config changes.
  useEffect(() => setKey((value) => value + 1), [config]);

  async function loader() {
    return config?.groups ?? [];
  }

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deleteDialogTitle",
    children: (
      <Trans i18nKey="deleteDialogDescription">
        {" "}
        <strong>{{ group: groupToDelete?.name }}</strong>.
      </Trans>
    ),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      const groups = (config?.groups ?? []).filter(
        (group) => group !== groupToDelete,
      );
      const translationsForDisplayHeaderToDelete =
        groupToDelete?.displayHeader?.substring(
          2,
          groupToDelete?.displayHeader.length - 1,
        );
      const translationsForDisplayDescriptionToDelete =
        groupToDelete?.displayDescription?.substring(
          2,
          groupToDelete?.displayDescription.length - 1,
        );

      try {
        await Promise.all(
          combinedLocales.map(async (locale) => {
            try {
              const response =
                await adminClient.realms.getRealmLocalizationTexts({
                  realm,
                  selectedLocale: locale,
                });

              if (response) {
                await adminClient.realms.deleteRealmLocalizationTexts({
                  realm,
                  selectedLocale: locale,
                  key: translationsForDisplayHeaderToDelete,
                });

                await adminClient.realms.deleteRealmLocalizationTexts({
                  realm,
                  selectedLocale: locale,
                  key: translationsForDisplayDescriptionToDelete,
                });

                const updatedData =
                  await adminClient.realms.getRealmLocalizationTexts({
                    realm,
                    selectedLocale: locale,
                  });
                setTableData([updatedData]);
              }
            } catch {
              console.error(`Error removing translations for ${locale}`);
            }
          }),
        );

        await save(
          { ...config, groups },
          {
            successMessageKey: "deleteSuccess",
            errorMessageKey: "deleteAttributeGroupError",
          },
        );
      } catch (error) {
        console.error(
          `Error removing translations or updating attributes group: ${error}`,
        );
      }
    },
  });

  function deleteAttributeGroup(group: UserProfileGroup) {
    setGroupToDelete(group);
    toggleDeleteDialog();
  }

  return (
    <PageSection variant="light" className="pf-v5-u-p-0">
      <DeleteConfirm />
      <KeycloakDataTable
        key={key}
        loader={loader}
        ariaLabelKey="tableTitle"
        toolbarItem={
          <ToolbarItem>
            <Button
              component={(props) => (
                <Link
                  data-testid="create-attributes-groups-action"
                  {...props}
                  to={toNewAttributesGroup({ realm })}
                />
              )}
            >
              {t("createGroupText")}
            </Button>
          </ToolbarItem>
        }
        columns={[
          {
            name: "name",
            displayKey: "columnName",
            cellRenderer: (group) => (
              <Link
                to={toEditAttributesGroup({
                  realm,
                  name: group.name!,
                })}
              >
                {group.name}
              </Link>
            ),
          },
          {
            name: "displayHeader",
            displayKey: "columnDisplayName",
          },
          {
            name: "displayDescription",
            displayKey: "columnDisplayDescription",
          },
        ]}
        actions={[
          {
            title: t("delete"),
            onRowClick: deleteAttributeGroup,
          } as Action<UserProfileGroup>,
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyStateMessage")}
            instructions={t("emptyStateInstructions")}
            primaryActionText={t("createGroupText")}
            onPrimaryAction={() => navigate(toNewAttributesGroup({ realm }))}
          />
        }
      />
    </PageSection>
  );
};
