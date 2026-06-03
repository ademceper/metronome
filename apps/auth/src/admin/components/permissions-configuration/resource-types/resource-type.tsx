/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/resource-types/ResourceType.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { cn } from "@metronome/ui/lib/utils";
import { HelpItem } from "../../../../shared/keycloak-ui-shared";
import { useFormContext } from "react-hook-form";
import { useState, type JSX } from "react";
import { GroupSelect } from "./group-select";
import { UserSelect } from "../../users/user-select";
import { RoleSelect } from "./role-select";
import { ClientSelectComponent } from "./client-select-component";


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
const Radio = ({ id, name, label, description, isChecked, onChange, isDisabled, value, ...props }: any) => (
  <div className="flex items-start gap-2">
    <input type="radio" id={id} name={name} value={value} checked={!!isChecked} disabled={isDisabled}
      onChange={(e) => onChange?.(e, e.target.checked)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);

type ResourceTypeProps = {
  withEnforceAccessTo?: boolean;
  resourceType: string;
};

export const COMPONENTS: {
  [index: string]: (props: any) => JSX.Element;
} = {
  users: UserSelect,
  clients: ClientSelectComponent,
  groups: GroupSelect,
  roles: RoleSelect,
} as const;

export const isValidComponentType = (value: string) => value in COMPONENTS;

export const ResourceType = ({
  resourceType,
  withEnforceAccessTo = true,
}: ResourceTypeProps) => {
  const { t } = useTranslation();
  const form = useFormContext();
  const resourceIds: string[] = form.getValues("resources");
  const normalizedResourceType = resourceType.toLowerCase();

  const [isSpecificResources, setIsSpecificResources] = useState(
    resourceIds?.some((id) => id !== resourceType) || !withEnforceAccessTo,
  );

  function getComponentType() {
    if (isValidComponentType(normalizedResourceType)) {
      return COMPONENTS[normalizedResourceType];
    }
    return null;
  }

  const ComponentType = getComponentType();

  return (
    <>
      {withEnforceAccessTo && (
        <FormGroup
          label={t("enforceAccessTo")}
          labelIcon={
            <HelpItem
              helpText={t("enforceAccessToHelpText")}
              fieldLabelId="enforce-access-to"
            />
          }
          fieldId="EnforceAccessTo"
          hasNoPaddingTop
          isRequired
        >
          <Radio
            id="allResources"
            data-testid="allResources"
            isChecked={!isSpecificResources}
            name="EnforceAccessTo"
            label={t(`allResourceType`, { resourceType })}
            onChange={() => {
              setIsSpecificResources(false);
              form.setValue("resources", []);
            }}
            className="pf-v5-u-mb-md"
          />
          <Radio
            id="specificResources"
            data-testid="specificResources"
            isChecked={isSpecificResources}
            name="EnforceAccessTo"
            label={t(`specificResourceType`, { resourceType })}
            onChange={() => {
              setIsSpecificResources(true);
              form.setValue("resources", []);
            }}
            className="pf-v5-u-mb-md"
          />
        </FormGroup>
      )}
      {isSpecificResources && ComponentType && (
        <ComponentType
          name={withEnforceAccessTo ? "resources" : "resource"}
          label={`${normalizedResourceType}Resources`}
          helpText={t("resourceTypeHelpText", {
            resourceType: normalizedResourceType,
          })}
          defaultValue={[]}
          variant={withEnforceAccessTo ? "typeaheadMulti" : "typeahead"}
          isRequired={withEnforceAccessTo}
          isRadio={!withEnforceAccessTo}
        />
      )}
    </>
  );
};
