/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/OrganizationForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import {
  FormErrorText,
  HelpItem,
  TextAreaControl,
  TextControl,
} from "../../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AttributeForm } from "../key-value-form/attribute-form";
import { keyValueToArray } from "../key-value-form/key-value-convert";
import { MultiLineInput } from "../multi-line-input/multi-line-input";


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

export type OrganizationFormType = AttributeForm &
  Omit<OrganizationRepresentation, "domains" | "attributes"> & {
    domains?: string[];
  };

export const convertToOrg = (
  org: OrganizationFormType,
): OrganizationRepresentation => ({
  ...org,
  domains: org.domains?.map((d) => ({ name: d, verified: false })),
  attributes: keyValueToArray(org.attributes),
});

type OrganizationFormProps = {
  readOnly?: boolean;
};

export const OrganizationForm = ({
  readOnly = false,
}: OrganizationFormProps) => {
  const { t } = useTranslation();
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const name = useWatch({ name: "name" });

  useEffect(() => {
    if (!readOnly) {
      setValue("alias", name);
    }
  }, [name, readOnly]);

  return (
    <>
      <TextControl
        label={t("name")}
        name="name"
        rules={{ required: t("required") }}
      />
      <TextControl
        label={t("alias")}
        name="alias"
        labelIcon={t("organizationAliasHelp")}
        isDisabled={readOnly}
      />
      <FormGroup
        label={t("domain")}
        fieldId="domain"
        labelIcon={
          <HelpItem
            helpText={t("organizationDomainHelp")}
            fieldLabelId="domain"
          />
        }
      >
        <MultiLineInput
          id="domain"
          name="domains"
          aria-label={t("domain")}
          addButtonLabel="addDomain"
        />
        {errors?.["domains"]?.message && (
          <FormErrorText message={errors["domains"].message.toString()} />
        )}
      </FormGroup>
      <TextControl
        label={t("redirectUrl")}
        name="redirectUrl"
        labelIcon={t("organizationRedirectUrlHelp")}
      />
      <TextAreaControl name="description" label={t("description")} />
    </>
  );
};
