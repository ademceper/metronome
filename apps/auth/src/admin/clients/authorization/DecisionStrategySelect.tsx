/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/DecisionStrategySelect.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { HelpItem } from "../../../shared/keycloak-ui-shared";


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

const DECISION_STRATEGY = ["UNANIMOUS", "AFFIRMATIVE", "CONSENSUS"] as const;

type DecisionStrategySelectProps = {
  helpLabel?: string;
  isDisabled?: boolean;
  isLimited?: boolean;
};

export const DecisionStrategySelect = ({
  helpLabel,
  isDisabled = false,
  isLimited = false,
}: DecisionStrategySelectProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormGroup
      label={t("decisionStrategy")}
      labelIcon={
        <HelpItem
          helpText={t(helpLabel || "decisionStrategyHelp")}
          fieldLabelId="decisionStrategy"
        />
      }
      fieldId="decisionStrategy"
      hasNoPaddingTop
    >
      <Controller
        name="decisionStrategy"
        data-testid="decisionStrategy"
        defaultValue={DECISION_STRATEGY[0]}
        control={control}
        render={({ field }) => (
          <>
            {(isLimited
              ? DECISION_STRATEGY.slice(0, 2)
              : DECISION_STRATEGY
            ).map((strategy) => (
              <Radio
                id={strategy}
                key={strategy}
                data-testid={strategy}
                isChecked={field.value === strategy}
                isDisabled={isDisabled}
                name="decisionStrategy"
                onChange={() => field.onChange(strategy)}
                label={t(`decisionStrategies.${strategy}`)}
                className="pf-v5-u-mb-md"
              />
            ))}
          </>
        )}
      />
    </FormGroup>
  );
};
