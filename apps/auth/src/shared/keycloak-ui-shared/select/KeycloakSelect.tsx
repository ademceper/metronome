/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/select/KeycloakSelect.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Select as UISelect, SelectContent as UISelectContent, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { SingleSelect } from "./SingleSelect";
import { TypeaheadSelect } from "./TypeaheadSelect";
import { Select } from "../../pf-compat"


const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
);
type ChipGroupProps = React.ComponentProps<typeof ChipGroup>;
type SelectProps = React.ComponentProps<typeof Select>;

export type Variant = `${SelectVariant}`;

export enum SelectVariant {
  single = "single",
  typeahead = "typeahead",
  typeaheadMulti = "typeaheadMulti",
}

export const propertyToString = (prop: string | number | undefined) =>
  typeof prop === "number" ? prop + "px" : prop;

export type KeycloakSelectProps = Omit<
  SelectProps,
  "name" | "toggle" | "selected" | "onClick" | "onSelect" | "variant"
> & {
  toggleId?: string;
  onFilter?: (value: string) => void;
  onClear?: () => void;
  variant?: Variant;
  isDisabled?: boolean;
  menuAppendTo?: string;
  maxHeight?: string | number;
  width?: string | number;
  toggleIcon?: React.ReactElement;
  direction?: "up" | "down";
  placeholderText?: string;
  onSelect?: (value: string | number | object) => void;
  onToggle: (val: boolean) => void;
  selections?: string | string[] | number | number[];
  validated?: "success" | "warning" | "error" | "default";
  typeAheadAriaLabel?: string;
  chipGroupProps?: Omit<ChipGroupProps, "children" | "ref">;
  chipGroupComponent?: React.ReactNode;
  footer?: React.ReactNode;
};
export const KeycloakSelect = ({
  variant = SelectVariant.single,
  ...rest
}: KeycloakSelectProps) => {
  if (variant === SelectVariant.single) {
    return <SingleSelect {...rest} />;
  } else {
    return <TypeaheadSelect {...rest} variant={variant} />;
  }
};
