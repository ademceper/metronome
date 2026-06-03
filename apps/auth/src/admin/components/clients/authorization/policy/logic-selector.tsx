/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/LogicSelector.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@metronome/ui/lib/utils";
import { HelpItem } from "../../../../../shared/keycloak-ui-shared";


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

const LOGIC_TYPES = ["POSITIVE", "NEGATIVE"] as const;

type LogicSelectorProps = {
  isDisabled?: boolean;
};

export const LogicSelector = ({ isDisabled }: LogicSelectorProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormGroup
      label={t("logic")}
      labelIcon={<HelpItem helpText={t("logicHelp")} fieldLabelId="logic" />}
      fieldId="logic"
      hasNoPaddingTop
    >
      <Controller
        name="logic"
        data-testid="logic"
        defaultValue={LOGIC_TYPES[0]}
        control={control}
        render={({ field }) => (
          <>
            {LOGIC_TYPES.map((type) => (
              <Radio
                id={type}
                key={type}
                data-testid={type}
                isChecked={field.value === type}
                name="logic"
                onChange={() => field.onChange(type)}
                label={t(`logicType.${type.toLowerCase()}`)}
                className="pf-v5-u-mb-md"
                isDisabled={isDisabled}
              />
            ))}
          </>
        )}
      />
    </FormGroup>
  );
};
