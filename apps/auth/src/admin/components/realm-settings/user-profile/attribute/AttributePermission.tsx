/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/attribute/AttributePermission.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormAccess } from "../../../form/FormAccess";
import { HelpItem } from "../../../../../shared/keycloak-ui-shared";

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
const Grid = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-2", className)} {...props}>{children}</div>
);
const GridItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

const Permissions = ({ name }: { name: string }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Grid>
      <Controller
        name={`permissions.${name}`}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <>
            <GridItem lg={4} sm={6}>
              <Checkbox
                id={`user-${name}`}
                label={t("user")}
                value="user"
                data-testid={`user-${name}`}
                isChecked={field.value.includes("user")}
                onChange={() => {
                  const option = "user";
                  const changedValue = field.value.includes(option)
                    ? field.value.filter((item: string) => item !== option)
                    : [...field.value, option];

                  field.onChange(changedValue);
                }}
              />
            </GridItem>
            <GridItem lg={8} sm={6}>
              <Checkbox
                id={`admin-${name}`}
                label={t("admin")}
                value="admin"
                data-testid={`admin-${name}`}
                isChecked={field.value.includes("admin")}
                onChange={() => {
                  const option = "admin";
                  const changedValue = field.value.includes(option)
                    ? field.value.filter((item: string) => item !== option)
                    : [...field.value, option];

                  field.onChange(changedValue);
                }}
              />
            </GridItem>
          </>
        )}
      />
    </Grid>
  );
};

export const AttributePermission = () => {
  const { t } = useTranslation();

  return (
    <FormAccess role="manage-realm" isHorizontal>
      <FormGroup
        hasNoPaddingTop
        label={t("whoCanEdit")}
        labelIcon={
          <HelpItem helpText={t("whoCanEditHelp")} fieldLabelId="whoCanEdit" />
        }
        fieldId="kc-who-can-edit"
      >
        <Permissions name="edit" />
      </FormGroup>
      <FormGroup
        hasNoPaddingTop
        label={t("whoCanView")}
        labelIcon={
          <HelpItem helpText={t("whoCanViewHelp")} fieldLabelId="whoCanView" />
        }
        fieldId="kc-who-can-view"
      >
        <Permissions name="view" />
      </FormGroup>
    </FormAccess>
  );
};
