/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/select-control/SelectControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Select as UISelect, SelectContent as UISelectContent, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { SingleSelectControl } from "./SingleSelectControl";
import { TypeaheadSelectControl } from "./TypeaheadSelectControl";
import { Select } from "../../../pf-compat"


const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
);
type ChipGroupProps = React.ComponentProps<typeof ChipGroup>;
type SelectProps = React.ComponentProps<typeof Select>;

type Variant = `${SelectVariant}`;

export enum SelectVariant {
  single = "single",
  typeahead = "typeahead",
  typeaheadMulti = "typeaheadMulti",
}

export type SelectControlOption = {
  key: string;
  value: string;
  description?: string;
};

export type OptionType = string[] | SelectControlOption[];

export type SelectControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = Omit<
  SelectProps,
  | "name"
  | "toggle"
  | "selections"
  | "onSelect"
  | "onClear"
  | "isOpen"
  | "onFilter"
  | "variant"
> &
  UseControllerProps<T, P> & {
    name: string;
    label?: string;
    options: OptionType;
    selectedOptions?: OptionType;
    labelIcon?: string;
    controller: Omit<ControllerProps, "name" | "render">;
    onFilter?: (value: string) => void;
    variant?: Variant;
    isDisabled?: boolean;
    isFullWidth?: boolean;
    menuAppendTo?: string;
    placeholderText?: string;
    chipGroupProps?: ChipGroupProps;
    onSelect?: (
      value: string | string[],
      onChangeHandler: (value: string | string[]) => void,
    ) => void;
  };

export const isSelectBasedOptions = (
  options: OptionType,
): options is SelectControlOption[] => typeof options[0] !== "string";

export const isString = (
  option: SelectControlOption | string,
): option is string => typeof option === "string";
export const key = (option: SelectControlOption | string) =>
  isString(option) ? option : option.key;

export const SelectControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  variant = SelectVariant.single,
  ...rest
}: SelectControlProps<T, P>) =>
  variant === SelectVariant.single ? (
    <SingleSelectControl {...rest} />
  ) : (
    <TypeaheadSelectControl {...rest} variant={variant} />
  );
