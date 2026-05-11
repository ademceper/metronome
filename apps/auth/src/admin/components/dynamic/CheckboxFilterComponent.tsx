/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/CheckboxFilterComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { Select, SelectOption } from "../../../shared/pf-compat"

const Badge = ({ isRead, ...props }: any) => <UIBadge {...props} />;
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

type CheckboxFilterOptions = {
  value: string;
  label: string;
};

type CheckboxFilterComponentProps = {
  filterPlaceholderText: string;
  isOpen: boolean;
  options: CheckboxFilterOptions[];
  onOpenChange: (isOpen: boolean) => void;
  onToggleClick: () => void;
  onSelect: (
    event: React.MouseEvent<HTMLButtonElement>,
    selection: string,
  ) => void;
  selectedItems: string[];
  width?: string;
};

export const CheckboxFilterComponent = ({
  filterPlaceholderText,
  isOpen,
  options,
  onOpenChange,
  onToggleClick,
  onSelect,
  selectedItems,
  width,
}: CheckboxFilterComponentProps) => {
  const toggle = (toggleRef: React.RefObject<HTMLButtonElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={{
        width,
      }}
    >
      {filterPlaceholderText}
      {selectedItems.length > 0 && (
        <Badge isRead className="pf-v5-u-m-xs">
          {selectedItems.length}
        </Badge>
      )}
    </MenuToggle>
  );

  return (
    <Select
      role="menu"
      id="checkbox-select"
      isOpen={isOpen}
      selected={selectedItems}
      onSelect={(event, value) => {
        onSelect(event as React.MouseEvent<HTMLButtonElement>, value as string);
      }}
      onOpenChange={onOpenChange}
      toggle={toggle}
      data-testid="checkbox-filter-select"
    >
      <SelectList>
        {options.map((option) => (
          <SelectOption
            key={option.value}
            hasCheckbox
            value={option.value}
            isSelected={selectedItems.includes(option.value)}
            data-testid={`checkbox-filter-option-${option.value}`}
          >
            {option.label}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
