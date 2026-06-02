/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/GroupComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { HelpItem } from "../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../admin-client";
import {
  useGroupResource,
  GroupResourceContext,
} from "../../context/group-resource/group-resource-context";
import { useServerInfo } from "../../context/server-info/server-info-provider";
import { GroupPickerDialog } from "../group/GroupPickerDialog";
import type { ComponentProps } from "./components";


const ActionList = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const ActionListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
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
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
);
const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
);

export const GroupComponent = ({
  name,
  label,
  helpText,
  required,
  convertToName,
}: ComponentProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openOrgGroups, setOpenOrgGroups] = useState(false);
  const [groups, setGroups] = useState<GroupRepresentation[]>();
  const { control, setValue } = useFormContext();
  const { adminClient } = useAdminClient();
  const serverInfo = useServerInfo();
  const hasLinkedOrganization = useGroupResource().isOrgGroups();
  const groupTypeFieldName = convertToName("groupType");

  // Get group type enum values from server
  const groupTypes = serverInfo.enums?.["type"] || [];
  const GROUP_TYPE_REALM =
    groupTypes.find((t: string) => t === "REALM") || "REALM";
  const GROUP_TYPE_ORG =
    groupTypes.find((t: string) => t === "ORGANIZATION") || "ORGANIZATION";

  const groupType = useWatch({
    name: groupTypeFieldName,
    control,
    defaultValue: GROUP_TYPE_REALM,
  });

  const shouldRenderOrgField =
    hasLinkedOrganization || groupType == GROUP_TYPE_ORG;
  return (
    <Controller
      name={convertToName(name!)}
      defaultValue=""
      control={control}
      render={({ field }) => (
        <>
          {open && (
            <GroupResourceContext value={adminClient.groups}>
              <GroupPickerDialog
                type="selectOne"
                text={{
                  title: "selectGroup",
                  ok: "select",
                }}
                onConfirm={(groups) => {
                  field.onChange(groups?.[0].path);
                  setValue(groupTypeFieldName, GROUP_TYPE_REALM);
                  setGroups(groups);
                  setOpen(false);
                }}
                onClose={() => setOpen(false)}
                filterGroups={groups}
              />
            </GroupResourceContext>
          )}
          {openOrgGroups && (
            <GroupPickerDialog
              type="selectOne"
              text={{
                title: "selectOrgGroup",
                ok: "select",
              }}
              onConfirm={(groups) => {
                field.onChange(groups?.[0].path);
                setValue(groupTypeFieldName, GROUP_TYPE_ORG);
                setGroups(groups);
                setOpenOrgGroups(false);
              }}
              onClose={() => setOpenOrgGroups(false)}
              filterGroups={groups}
            />
          )}

          <FormGroup
            label={t(label!)}
            labelIcon={
              <HelpItem helpText={t(helpText!)} fieldLabelId={`${label}`} />
            }
            fieldId={name!}
            isRequired={required}
          >
            <ActionList>
              <ActionListItem>
                <ChipGroup>
                  {field.value && (
                    <Chip
                      onClick={() => {
                        field.onChange(undefined);
                        setValue(groupTypeFieldName, undefined);
                      }}
                    >
                      {shouldRenderOrgField && (
                        <>
                          {groupType === GROUP_TYPE_REALM
                            ? t("realm")
                            : t("organization")}
                          :&nbsp;
                        </>
                      )}
                      {field.value}
                    </Chip>
                  )}
                </ChipGroup>
              </ActionListItem>
              <ActionListItem>
                <Button
                  id="kc-join-groups-button"
                  onClick={() => setOpen(true)}
                  variant="secondary"
                  data-testid="join-groups-button"
                >
                  {t("selectGroup")}
                </Button>
              </ActionListItem>
              {shouldRenderOrgField && (
                <ActionListItem>
                  <Button
                    id="kc-join-org-groups-button"
                    onClick={() => setOpenOrgGroups(true)}
                    variant="secondary"
                    data-testid="join-org-groups-button"
                  >
                    {t("selectOrgGroup")}
                  </Button>
                </ActionListItem>
              )}
            </ActionList>
          </FormGroup>
        </>
      )}
    />
  );
};
