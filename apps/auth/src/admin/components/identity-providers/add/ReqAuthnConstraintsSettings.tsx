/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/ReqAuthnConstraintsSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  HelpItem,
  KeycloakSelect,
  SelectVariant,
} from "../../../../shared/keycloak-ui-shared";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MultiLineInput } from "../../multi-line-input/MultiLineInput";
import { SelectOption } from "../../../../shared/pf-compat"


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

const comparisonValues = ["exact", "minimum", "maximum", "better"];

export const ReqAuthnConstraints = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [comparisonOpen, setComparisonOpen] = useState(false);
  return (
    <>
      <FormGroup
        label={t("comparison")}
        labelIcon={
          <HelpItem helpText={t("comparisonHelp")} fieldLabelId="comparison" />
        }
        fieldId="comparison"
      >
        <Controller
          name="config.authnContextComparisonType"
          defaultValue={comparisonValues[0]}
          control={control}
          render={({ field }) => (
            <KeycloakSelect
              toggleId="comparison"
              direction="up"
              onToggle={(isExpanded) => setComparisonOpen(isExpanded)}
              onSelect={(value) => {
                field.onChange(value.toString());
                setComparisonOpen(false);
              }}
              selections={field.value}
              variant={SelectVariant.single}
              aria-label={t("comparison")}
              isOpen={comparisonOpen}
            >
              {comparisonValues.map((option) => (
                <SelectOption
                  selected={option === field.value}
                  key={option}
                  value={option}
                >
                  {t(option)}
                </SelectOption>
              ))}
            </KeycloakSelect>
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("authnContextClassRefs")}
        fieldId="kc-authnContextClassRefs"
        labelIcon={
          <HelpItem
            helpText={t("authnContextClassRefsHelp")}
            fieldLabelId="authnContextClassRefs"
          />
        }
      >
        <MultiLineInput
          name="config.authnContextClassRefs"
          aria-label={t("identify-providers:authnContextClassRefs")}
          addButtonLabel="addAuthnContextClassRef"
          data-testid="classref-field"
        />
      </FormGroup>
      <FormGroup
        label={t("authnContextDeclRefs")}
        fieldId="kc-authnContextDeclRefs"
        labelIcon={
          <HelpItem
            helpText={t("authnContextDeclRefsHelp")}
            fieldLabelId="authnContextDeclRefs"
          />
        }
      >
        <MultiLineInput
          name="config.authnContextDeclRefs"
          aria-label={t("identify-providers:authnContextDeclRefs")}
          addButtonLabel="addAuthnContextDeclRef"
          data-testid="declref-field"
        />
      </FormGroup>
    </>
  );
};
