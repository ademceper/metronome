/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/ExtendedNonDiscoverySettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  HelpItem,
  KeycloakSelect,
  SelectVariant,
} from "../../../../shared/keycloak-ui-shared";
import { Collapsible as UICollapsible, CollapsibleContent as UICollapsibleContent, CollapsibleTrigger as UICollapsibleTrigger } from "@metronome/ui/components/collapsible";
import { Input as UIInput } from "@metronome/ui/components/input";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormGroupField } from "../component/form-group-field";
import { SwitchField } from "../component/switch-field";
import { TextField } from "../component/text-field";
import { SelectOption } from "../../../../shared/pf-compat"


const ExpandableSection = ({ toggleText, toggleTextExpanded, toggleTextCollapsed, isExpanded, onToggle, isDetached, children, ...props }: any) => (
  <UICollapsible open={isExpanded} onOpenChange={(open: boolean) => onToggle?.(undefined, open)} {...props}>
    <UICollapsibleTrigger className="flex items-center gap-2 text-sm">
      {isExpanded ? (toggleTextExpanded ?? toggleText) : (toggleTextCollapsed ?? toggleText)}
    </UICollapsibleTrigger>
    <UICollapsibleContent>{children}</UICollapsibleContent>
  </UICollapsible>
);
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
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
const NumberInput = ({ value, onChange, min, max, step, ...props }: any) => (
  <UIInput type="number" value={value ?? ""}
    onChange={(e: any) => onChange?.(e)} min={min} max={max} step={step} {...props} />
);

const promptOptions = {
  unspecified: "",
  none: "none",
  consent: "consent",
  login: "login",
  select_account: "select_account",
};

export const ExtendedNonDiscoverySettings = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);

  return (
    <ExpandableSection
      toggleText={t("advanced")}
      onToggle={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <Form isHorizontal>
        <SwitchField label="passLoginHint" field="config.loginHint" />
        <SwitchField label="passMaxAge" field="config.passMaxAge" />
        <SwitchField label="passCurrentLocale" field="config.uiLocales" />
        <SwitchField
          field="config.backchannelSupported"
          label="backchannelLogout"
        />
        <SwitchField
          field="config.sendIdTokenOnLogout"
          label="sendIdTokenOnLogout"
          defaultValue={"true"}
        />
        <SwitchField
          field="config.sendClientIdOnLogout"
          label="sendClientIdOnLogout"
        />
        <SwitchField field="config.disableUserInfo" label="disableUserInfo" />
        <SwitchField field="config.disableNonce" label="disableNonce" />
        <SwitchField
          field="config.disableTypeClaimCheck"
          label="disableTypeClaimCheck"
        />
        <TextField field="config.defaultScope" label="scopes" />
        <FormGroupField label="prompt">
          <Controller
            name="config.prompt"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <KeycloakSelect
                toggleId="prompt"
                onToggle={() => setPromptOpen(!promptOpen)}
                onSelect={(value) => {
                  field.onChange(value as string);
                  setPromptOpen(false);
                }}
                selections={field.value || t(`prompts.unspecified`)}
                variant={SelectVariant.single}
                aria-label={t("prompt")}
                isOpen={promptOpen}
              >
                {Object.entries(promptOptions).map(([key, val]) => (
                  <SelectOption
                    selected={val === field.value}
                    key={key}
                    value={val}
                  >
                    {t(`prompts.${key}`)}
                  </SelectOption>
                ))}
              </KeycloakSelect>
            )}
          />
        </FormGroupField>
        <SwitchField
          field="config.acceptsPromptNoneForwardFromClient"
          label="acceptsPromptNone"
        />
        <SwitchField
          field="config.requiresShortStateParameter"
          label="requiresShortStateParameter"
        />
        <FormGroup
          label={t("allowedClockSkew")}
          labelIcon={
            <HelpItem
              helpText={t("allowedClockSkewHelp")}
              fieldLabelId="allowedClockSkew"
            />
          }
          fieldId="allowedClockSkew"
        >
          <Controller
            name="config.allowedClockSkew"
            defaultValue={0}
            control={control}
            render={({ field }) => {
              const v = Number(field.value);
              return (
                <NumberInput
                  data-testid="allowedClockSkew"
                  inputName="allowedClockSkew"
                  min={0}
                  max={2147483}
                  value={v}
                  readOnly
                  onPlus={() => field.onChange(v + 1)}
                  onMinus={() => field.onChange(v - 1)}
                  onChange={(event) => {
                    const value = Number(
                      (event.target as HTMLInputElement).value,
                    );
                    field.onChange(value < 0 ? 0 : value);
                  }}
                />
              );
            }}
          />
        </FormGroup>
        <TextField field="config.forwardParameters" label="forwardParameters" />
      </Form>
    </ExpandableSection>
  );
};
