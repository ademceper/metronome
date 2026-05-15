/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/attribute/KeySelect.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  KeycloakSelect,
  SelectControlOption,
} from "../../../../../shared/keycloak-ui-shared";
import { Input as UIInput } from "@metronome/ui/components/input";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { UseControllerProps, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useToggle from "../../../../utils/useToggle";
import { SelectOption } from "../../../../../shared/pf-compat"


const Grid = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-2", className)} {...props}>{children}</div>
);
const GridItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

type KeySelectProp = UseControllerProps & {
  selectItems: SelectControlOption[];
};

export const KeySelect = ({ selectItems, ...rest }: KeySelectProp) => {
  const { t } = useTranslation();
  const [open, toggle] = useToggle();
  const { field } = useController(rest);
  const [custom, setCustom] = useState(
    !selectItems.map(({ key }) => key).includes(field.value),
  );

  return (
    <Grid>
      <GridItem lg={custom ? 2 : 12}>
        <KeycloakSelect
          onToggle={() => toggle()}
          isOpen={open}
          onSelect={(value) => {
            if (value) {
              setCustom(false);
            }
            field.onChange(value);
            toggle();
          }}
          selections={!custom ? [field.value] : ""}
        >
          {[
            <SelectOption key="custom" onClick={() => setCustom(true)}>
              {t("customAttribute")}
            </SelectOption>,
            ...selectItems.map((item) => (
              <SelectOption key={item.key} value={item.key}>
                {item.value}
              </SelectOption>
            )),
          ]}
        </KeycloakSelect>
      </GridItem>
      {custom && (
        <GridItem lg={10}>
          <TextInput
            id="customValue"
            data-testid={rest.name}
            placeholder={t("keyPlaceholder")}
            value={field.value}
            onChange={field.onChange}
            autoFocus
          />
        </GridItem>
      )}
    </Grid>
  );
};
