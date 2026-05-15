/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/AttributesTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { UserProfileAttribute } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import {
  KeycloakSelect,
  SelectVariant,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { cn } from "@metronome/ui/lib/utils";
import { Funnel as FilterIcon } from "@phosphor-icons/react"
import { uniqBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { DraggableTable } from "../../authentication/components/DraggableTable";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { KeycloakSpinner } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/RealmContext";
import useLocale from "../../utils/useLocale";
import useToggle from "../../utils/useToggle";
import { toAddAttribute } from "../paths/AddAttribute";
import { toAttribute } from "../paths/Attribute";
import { useUserProfile } from "./UserProfileContext";
import { SelectOption } from "../../../shared/pf-compat"


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
const Divider = (props: any) => <UISeparator {...props} />;
const Toolbar = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const ToolbarContent = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>{children}</div>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

const RESTRICTED_ATTRIBUTES = ["username", "email"];

type movedAttributeType = UserProfileAttribute;

type AttributesTabProps = {
  setTableData: React.Dispatch<
    React.SetStateAction<Record<string, string>[] | undefined>
  >;
};

export const AttributesTab = ({ setTableData }: AttributesTabProps) => {
  const { adminClient } = useAdminClient();
  const { config, save } = useUserProfile();
  const { realm } = useRealm();
  const { t } = useTranslation();
  const combinedLocales = useLocale();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("allGroups");
  const [isFilterTypeDropdownOpen, toggleIsFilterTypeDropdownOpen] =
    useToggle();
  const [data, setData] = useState(config?.attributes);
  const [attributeToDelete, setAttributeToDelete] = useState("");

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteAttributeConfirmTitle"),
    messageKey: t("deleteAttributeConfirm", {
      attributeName: attributeToDelete,
    }),
    continueButtonLabel: t("delete"),
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      if (!config?.attributes) return;

      const translationsToDelete = config.attributes.find(
        (attribute) => attribute.name === attributeToDelete,
      )?.displayName;

      // Remove the the `${}` from translationsToDelete string
      const formattedTranslationsToDelete = translationsToDelete?.substring(
        2,
        translationsToDelete.length - 1,
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
                  key: formattedTranslationsToDelete,
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

        const updatedAttributes = config.attributes.filter(
          (attribute) => attribute.name !== attributeToDelete,
        );

        await save(
          { ...config, attributes: updatedAttributes, groups: config.groups },
          {
            successMessageKey: "deleteAttributeSuccess",
            errorMessageKey: "deleteAttributeError",
          },
        );

        setAttributeToDelete("");
      } catch (error) {
        console.error(
          `Error removing translations or updating attributes: ${error}`,
        );
      }
    },
  });

  if (!config) {
    return <KeycloakSpinner />;
  }

  const attributes = config.attributes ?? [];
  const groups = config.groups ?? [];

  const executeMove = async (
    attribute: UserProfileAttribute,
    newIndex: number,
  ) => {
    const fromIndex = attributes.findIndex((attr) => {
      return attr.name === attribute.name;
    });

    let movedAttribute: movedAttributeType = {};
    movedAttribute = attributes[fromIndex];
    attributes.splice(fromIndex, 1);
    attributes.splice(newIndex, 0, movedAttribute);

    await save(
      { ...config, attributes, groups },
      {
        successMessageKey: "updatedUserProfileSuccess",
        errorMessageKey: "updatedUserProfileError",
      },
    );
  };

  const cellFormatter = (row: UserProfileAttribute) => (
    <Link
      to={toAttribute({
        realm,
        attributeName: row.name!,
      })}
      key={row.name}
    >
      {row.name}
    </Link>
  );

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <KeycloakSelect
              toggleId="kc-group-filter"
              width={200}
              data-testid="filter-select"
              isOpen={isFilterTypeDropdownOpen}
              variant={SelectVariant.single}
              onToggle={toggleIsFilterTypeDropdownOpen}
              toggleIcon={<FilterIcon />}
              onSelect={(value) => {
                const filter = value.toString();
                setFilter(filter);
                setData(
                  filter === "allGroups"
                    ? attributes
                    : attributes.filter((attr) => attr.group === filter),
                );
                toggleIsFilterTypeDropdownOpen();
              }}
              selections={filter === "allGroups" ? t(filter) : filter}
            >
              {[
                <SelectOption
                  key="allGroups"
                  data-testid="all-groups"
                  value="allGroups"
                >
                  {t("allGroups")}
                </SelectOption>,
                ...uniqBy(
                  attributes.filter((attr) => !!attr.group),
                  "group",
                ).map((attr) => (
                  <SelectOption key={attr.group} value={attr.group}>
                    {attr.group}
                  </SelectOption>
                )),
              ]}
            </KeycloakSelect>
          </ToolbarItem>
          <ToolbarItem className="kc-toolbar-attributesTab">
            <Button
              data-testid="createAttributeBtn"
              variant="primary"
              component={(props) => (
                <Link {...props} to={toAddAttribute({ realm })} />
              )}
            >
              {t("createAttribute")}
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Divider />
      <DeleteConfirm />
      <DraggableTable
        keyField="name"
        onDragFinish={async (nameDragged, items) => {
          const keys = attributes.map((e) => e.name);
          const newIndex = items.indexOf(nameDragged);
          const oldIndex = keys.indexOf(nameDragged);
          const dragged = attributes[oldIndex];
          if (!dragged.name) return;

          await executeMove(dragged, newIndex);
        }}
        actions={[
          {
            title: t("edit"),
            onClick: (_key, _idx, component) => {
              navigate(
                toAttribute({
                  realm,
                  attributeName: component.name,
                }),
              );
            },
          },
          {
            title: t("delete"),
            isActionable: ({ name }) => !RESTRICTED_ATTRIBUTES.includes(name!),
            onClick: (_key, _idx, component) => {
              setAttributeToDelete(component.name);
              toggleDeleteDialog();
            },
          },
        ]}
        columns={[
          {
            name: "name",
            displayKey: t("attributeName"),
            cellRenderer: cellFormatter,
          },
          {
            name: "displayName",
            displayKey: t("attributeDisplayName"),
          },
          {
            name: "group",
            displayKey: t("attributeGroup"),
          },
        ]}
        data={data ?? attributes}
      />
    </>
  );
};
