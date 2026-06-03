/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/Group.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import {
  HelpItem,
  TextControl,
  useFetch,
} from "../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { cn } from "@metronome/ui/lib/utils";
import { MinusCircle as MinusCircleIcon } from "@phosphor-icons/react"
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table/table";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../../admin-client";
import { GroupPickerDialog } from "../../../group/group-picker-dialog";
import { GroupResourceContext } from "../../../../context/group-resource/group-resource-context";


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
const Checkbox = ({ id, label, description, isChecked, isDisabled, onChange, name, ...props }: any) => (
  <div className="flex items-start gap-2">
    <UICheckbox id={id} name={name} checked={isChecked} disabled={isDisabled}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
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

type GroupForm = {
  groups?: GroupValue[];
  groupsClaim: string;
};

export type GroupValue = {
  id: string;
  extendChildren: boolean;
};

export const Group = () => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { control, getValues, setValue } = useFormContext<GroupForm>();
  const values = getValues("groups");

  const [open, setOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<GroupRepresentation[]>(
    [],
  );

  useFetch(
    () => {
      if (values && values.length > 0)
        return Promise.all(
          values.map((g) => adminClient.groups.findOne({ id: g.id })),
        );
      return Promise.resolve([]);
    },
    (groups) => {
      const filteredGroup = groups.filter((g) => g) as GroupRepresentation[];
      setSelectedGroups(filteredGroup);
    },
    [],
  );

  return (
    <>
      <TextControl
        name="groupsClaim"
        label={t("groupsClaim")}
        labelIcon={t("groupsClaimHelp")}
      />
      <FormGroup
        label={t("groups")}
        labelIcon={
          <HelpItem helpText={t("policyGroupsHelp")} fieldLabelId="groups" />
        }
        fieldId="groups"
      >
        <Controller
          name="groups"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <>
              {open && (
                <GroupResourceContext value={adminClient.groups}>
                  <GroupPickerDialog
                    type="selectMany"
                    text={{
                      title: "addGroupsToGroupPolicy",
                      ok: "add",
                    }}
                    onConfirm={(groups) => {
                      field.onChange([
                        ...(field.value || []),
                        ...(groups || []).map(({ id }) => ({ id })),
                      ]);
                      setSelectedGroups([...selectedGroups, ...(groups || [])]);
                      setOpen(false);
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    filterGroups={selectedGroups}
                  />
                </GroupResourceContext>
              )}
              <Button
                data-testid="select-group-button"
                variant="secondary"
                onClick={() => {
                  setOpen(true);
                }}
              >
                {t("addGroups")}
              </Button>
            </>
          )}
        />
        {selectedGroups.length > 0 && (
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>{t("groups")}</Th>
                <Th>{t("extendToChildren")}</Th>
                <Th aria-hidden="true" />
              </Tr>
            </Thead>
            <Tbody>
              {selectedGroups.map((group, index) => (
                <Tr key={group.id}>
                  <Td>{group.path}</Td>
                  <Td>
                    <Controller
                      name={`groups.${index}.extendChildren`}
                      defaultValue={false}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="extendChildren"
                          data-testid="standard"
                          name="extendChildren"
                          isChecked={field.value}
                          onChange={field.onChange}
                          isDisabled={group.subGroupCount === 0}
                        />
                      )}
                    />
                  </Td>
                  <Td>
                    <Button
                      variant="link"
                      className="keycloak__client-authorization__policy-row-remove"
                      icon={<MinusCircleIcon />}
                      onClick={() => {
                        setValue("groups", [
                          ...(values || []).filter(({ id }) => id !== group.id),
                        ]);
                        setSelectedGroups([
                          ...selectedGroups.filter(({ id }) => id !== group.id),
                        ]);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </FormGroup>
    </>
  );
};
