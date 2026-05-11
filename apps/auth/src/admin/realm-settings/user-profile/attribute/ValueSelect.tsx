/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/attribute/ValueSelect.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { KeycloakSelect } from "../../../../shared/keycloak-ui-shared";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { useState } from "react";
import { UseControllerProps, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SelectOption } from "../../../../shared/pf-compat"



type ValueSelectProps = UseControllerProps & {
  selectItems: string[];
};

export const ValueSelect = ({ selectItems, ...rest }: ValueSelectProps) => {
  const { t } = useTranslation();
  const { field } = useController(rest);
  const [open, setOpen] = useState(false);

  return (
    <KeycloakSelect
      onToggle={(isOpen) => setOpen(isOpen)}
      isOpen={open}
      onSelect={(value) => {
        field.onChange(value);
        setOpen(false);
      }}
      selections={field.value ? [field.value] : t("choose")}
      placeholderText={t("valuePlaceholder")}
    >
      {selectItems.map((item) => (
        <SelectOption key={item} value={item}>
          {item}
        </SelectOption>
      ))}
    </KeycloakSelect>
  );
};
