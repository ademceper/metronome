/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/select/TypeaheadSelect.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { X as TimesIcon } from "@phosphor-icons/react"
import { Children, useRef, useState } from "react";
import {
  KeycloakSelectProps,
  SelectVariant,
  propertyToString,
} from "./KeycloakSelect";
import { Select, SelectOption } from "../../pf-compat"


const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
);
const MenuFooter = ({ children, className, ...props }: any) => (
  <div className={cn("border-t px-2 py-1.5 text-sm", className)} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const MenuToggleStatus = {
  default: "default",
  success: "success",
  warning: "warning",
  danger: "danger",
} as const;
const SelectList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const TextInputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const TextInputGroupMain = ({ children, ...props }: any) => (
  <div className="flex-1" {...props}>{children}</div>
);
const TextInputGroupUtilities = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>{children}</div>
);
type SelectOptionProps = React.ComponentProps<typeof SelectOption>;

export const TypeaheadSelect = ({
  toggleId,
  onSelect,
  onToggle,
  onFilter,
  variant,
  validated,
  placeholderText,
  maxHeight,
  width,
  toggleIcon,
  direction,
  selections,
  typeAheadAriaLabel,
  chipGroupComponent,
  chipGroupProps,
  footer,
  isDisabled,
  children,
  ...rest
}: KeycloakSelectProps) => {
  const [filterValue, setFilterValue] = useState("");
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(0);
  const textInputRef = useRef<HTMLInputElement>();

  const childArray = Children.toArray(
    children,
  ) as React.ReactElement<SelectOptionProps>[];

  const toggle = () => {
    onToggle?.(!rest.isOpen);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedItem = childArray[focusedItemIndex];
    onToggle?.(true);

    switch (event.key) {
      case "Enter": {
        event.preventDefault();

        if (variant !== SelectVariant.typeaheadMulti) {
          setFilterValue(focusedItem.props.value);
        } else {
          setFilterValue("");
        }
        onSelect?.(focusedItem.props.value);
        onToggle?.(false);
        setFocusedItemIndex(0);

        break;
      }
      case "Escape": {
        onToggle?.(false);
        break;
      }
      case "Backspace": {
        if (variant === SelectVariant.typeahead) {
          onSelect?.("");
        }
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();

        let indexToFocus = 0;

        if (event.key === "ArrowUp") {
          if (focusedItemIndex === 0) {
            indexToFocus = childArray.length - 1;
          } else {
            indexToFocus = focusedItemIndex - 1;
          }
        }

        if (event.key === "ArrowDown") {
          if (focusedItemIndex === childArray.length - 1) {
            indexToFocus = 0;
          } else {
            indexToFocus = focusedItemIndex + 1;
          }
        }

        setFocusedItemIndex(indexToFocus);
        break;
      }
    }
  };

  return (
    <Select
      {...rest}
      onClick={toggle}
      onOpenChange={(isOpen) => onToggle?.(isOpen)}
      onSelect={(_, value) => {
        onSelect?.(value || "");
        onFilter?.("");
        setFilterValue("");
      }}
      maxMenuHeight={propertyToString(maxHeight)}
      popperProps={{ direction, width: propertyToString(width) }}
      toggle={(ref) => (
        <MenuToggle
          ref={ref}
          id={toggleId}
          variant="typeahead"
          onClick={() => onToggle?.(true)}
          icon={toggleIcon}
          isDisabled={isDisabled}
          isExpanded={rest.isOpen}
          isFullWidth
          status={validated === "error" ? MenuToggleStatus.danger : undefined}
        >
          <TextInputGroup isPlain>
            <TextInputGroupMain
              placeholder={placeholderText}
              value={
                variant === SelectVariant.typeahead && selections
                  ? (selections as string)
                  : filterValue
              }
              onClick={toggle}
              onChange={(_, value) => {
                setFilterValue(value);
                onFilter?.(value);
              }}
              onKeyDown={(event) => onInputKeyDown(event)}
              autoComplete="off"
              innerRef={textInputRef}
              role="combobox"
              isExpanded={rest.isOpen}
              aria-controls="select-typeahead-listbox"
              aria-label={typeAheadAriaLabel}
            >
              {variant === SelectVariant.typeaheadMulti &&
                Array.isArray(selections) &&
                (chipGroupComponent ? (
                  chipGroupComponent
                ) : (
                  <ChipGroup {...chipGroupProps}>
                    {selections.map((selection, index: number) => (
                      <Chip
                        key={index}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onSelect?.(selection);
                        }}
                      >
                        {selection}
                      </Chip>
                    ))}
                  </ChipGroup>
                ))}
            </TextInputGroupMain>
            <TextInputGroupUtilities>
              {!!filterValue && (
                <Button
                  variant="plain"
                  onClick={() => {
                    onSelect?.("");
                    setFilterValue("");
                    onFilter?.("");
                    textInputRef?.current?.focus();
                  }}
                  aria-label="Clear input value"
                >
                  <TimesIcon aria-hidden />
                </Button>
              )}
            </TextInputGroupUtilities>
          </TextInputGroup>
        </MenuToggle>
      )}
    >
      <SelectList>{children}</SelectList>
      {footer && <MenuFooter>{footer}</MenuFooter>}
    </Select>
  );
};
