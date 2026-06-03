/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/resource-types/GroupSelect.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import {
  FormErrorText,
  HelpItem,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
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
import { useAdminClient } from "../../../admin-client";
import type { ComponentProps } from "../../dynamic/components";
import { GroupPickerDialog } from "../../group/group-picker-dialog";
import { GroupResourceContext } from "../../../context/group-resource/group-resource-context";


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

type GroupSelectProps = Omit<ComponentProps, "convertToName"> & {
  variant?: "typeahead" | "typeaheadMulti";
  isRequired?: boolean;
};

const convertGroups = (groups: GroupRepresentation[]): string[] =>
  groups.map(({ id }) => id!);

export const GroupSelect = ({
  name,
  label,
  helpText,
  defaultValue,
  isDisabled = false,
  isRequired,
  variant = "typeaheadMulti",
}: GroupSelectProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const values: string[] = getValues(name!);
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<GroupRepresentation[]>([]);

  useFetch(
    () => {
      if (values && values.length > 0) {
        return Promise.all(
          (values as string[]).map((id) => adminClient.groups.findOne({ id })),
        );
      }
      return Promise.resolve([]);
    },
    (groups) => {
      setGroups(groups.flat().filter((g) => g) as GroupRepresentation[]);
    },
    [],
  );

  const selectOne = variant === "typeahead";

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId="groups" />}
      fieldId="groups"
      isRequired={isRequired}
    >
      <Controller
        name={name!}
        control={control}
        defaultValue={defaultValue}
        rules={{
          validate: (value?: string[]) =>
            !isRequired || (value && value.length > 0),
        }}
        render={({ field }) => (
          <>
            {open && (
              <GroupResourceContext value={adminClient.groups}>
                <GroupPickerDialog
                  type={selectOne ? "selectOne" : "selectMany"}
                  text={{
                    title: "addGroupsToGroupPolicy",
                    ok: "add",
                  }}
                  onConfirm={(selectGroup) => {
                    if (selectOne) {
                      field.onChange(convertGroups(selectGroup || []));
                      setGroups(selectGroup || []);
                    } else {
                      field.onChange([
                        ...(field.value || []),
                        ...convertGroups(selectGroup || []),
                      ]);
                      setGroups([...groups, ...(selectGroup || [])]);
                    }
                    setOpen(false);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  filterGroups={groups}
                />
              </GroupResourceContext>
            )}
            <Button
              data-testid="select-group-button"
              isDisabled={isDisabled}
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
      {groups.length > 0 && (
        <Table variant="compact">
          <Thead>
            <Tr>
              <Th>{t("groups")}</Th>
              <Th aria-hidden="true" />
            </Tr>
          </Thead>
          <Tbody>
            {groups.map((group) => (
              <Tr key={group.id}>
                <Td>{group.path}</Td>
                <Td>
                  <Button
                    variant="link"
                    className="keycloak__client-authorization__policy-row-remove"
                    icon={<MinusCircleIcon />}
                    onClick={() => {
                      setValue(name!, [
                        ...convertGroups(
                          (groups || []).filter(({ id }) => id !== group.id),
                        ),
                      ]);
                      setGroups([
                        ...groups.filter(({ id }) => id !== group.id),
                      ]);
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      {errors[name!] && <FormErrorText message={t("requiredGroups")} />}
    </FormGroup>
  );
};
