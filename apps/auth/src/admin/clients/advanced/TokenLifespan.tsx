/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/advanced/TokenLifespan.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { HelpItem } from "../../../shared/keycloak-ui-shared";
import {
  TimeSelector,
  Unit,
} from "../../components/time-selector/TimeSelector";
import { Select, SelectOption } from "../../../shared/pf-compat"


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
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const SelectList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);

type TokenLifespanProps = {
  id: string;
  name: string;
  defaultValue?: number;
  units?: Unit[];
};

const inherited = "tokenLifespan.inherited";
const expires = "tokenLifespan.expires";

export const TokenLifespan = ({
  id,
  name,
  defaultValue,
  units,
}: TokenLifespanProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const { control } = useFormContext();
  const isExpireSet = (value: string | number) =>
    typeof value === "number" ||
    (typeof value === "string" && value !== "") ||
    focused;

  return (
    <FormGroup
      label={t(id)}
      fieldId={id}
      labelIcon={<HelpItem helpText={t(`${id}Help`)} fieldLabelId={id} />}
      data-testid={`token-lifespan-${id}`}
    >
      <Controller
        name={name}
        defaultValue=""
        control={control}
        render={({ field }) => (
          <Split hasGutter>
            <SplitItem>
              <Select
                toggle={(ref) => (
                  <MenuToggle
                    ref={ref}
                    onClick={() => setOpen(!open)}
                    isExpanded={open}
                  >
                    {isExpireSet(field.value) ? t(expires) : t(inherited)}
                  </MenuToggle>
                )}
                isOpen={open}
                onOpenChange={(isOpen) => setOpen(isOpen)}
                onSelect={(_, value) => {
                  field.onChange(value);
                  setOpen(false);
                }}
                selected={isExpireSet(field.value) ? t(expires) : t(inherited)}
              >
                <SelectList>
                  <SelectOption value="">{t(inherited)}</SelectOption>
                  <SelectOption value={60}>{t(expires)}</SelectOption>
                </SelectList>
              </Select>
            </SplitItem>
            <SplitItem hidden={!isExpireSet(field.value)}>
              <TimeSelector
                validated={
                  isExpireSet(field.value) && field.value! < 1
                    ? "warning"
                    : "default"
                }
                units={units}
                value={field.value === "" ? defaultValue : field.value}
                onChange={field.onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                min={1}
                isDisabled={!isExpireSet(field.value)}
              />
            </SplitItem>
          </Split>
        )}
      />
    </FormGroup>
  );
};
