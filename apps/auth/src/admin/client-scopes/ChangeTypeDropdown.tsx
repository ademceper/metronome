/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/client-scopes/ChangeTypeDropdown.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Select as UISelect, SelectContent as UISelectContent, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";
import type { Row } from "../clients/scopes/ClientScopes";
import { useAlerts } from "../../shared/keycloak-ui-shared";
import {
  ClientScope,
  allClientScopeTypes,
  changeClientScope,
  changeScope,
  clientScopeTypesSelectOptions,
} from "../components/client-scope/ClientScopeTypes";
import { Select } from "../../shared/pf-compat"


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
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

type ChangeTypeDropdownProps = {
  clientId?: string;
  selectedRows: Row[];
  refresh: () => void;
};

export const ChangeTypeDropdown = ({
  clientId,
  selectedRows,
  refresh,
}: ChangeTypeDropdownProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { addAlert, addError } = useAlerts();

  return (
    <Select
      aria-label="change-type-to"
      onOpenChange={(isOpen) => setOpen(isOpen)}
      isOpen={open}
      toggle={(ref) => (
        <MenuToggle
          id="change-type-dropdown"
          isDisabled={selectedRows.length === 0}
          ref={ref}
          onClick={() => setOpen(!open)}
          isExpanded={open}
        >
          {t("changeTypeTo")}
        </MenuToggle>
      )}
      onSelect={async (_, value) => {
        try {
          await Promise.all(
            selectedRows.map((row) => {
              return clientId
                ? changeClientScope(
                    adminClient,
                    clientId,
                    row,
                    row.type,
                    value as ClientScope,
                  )
                : changeScope(adminClient, row, value as ClientScope);
            }),
          );
          setOpen(false);
          refresh();
          addAlert(t("clientScopeSuccess"), AlertVariant.success);
        } catch (error) {
          addError("clientScopeError", error);
        }
      }}
    >
      <SelectList>
        {clientScopeTypesSelectOptions(
          t,
          !clientId ? allClientScopeTypes : undefined,
        )}
      </SelectList>
    </Select>
  );
};
