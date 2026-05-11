/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/help-enabler/HelpHeader.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useHelp } from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { Question as HelpIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import helpUrls from "../../help-urls";
import { FormattedLink } from "../external-link/FormattedLink";

const Divider = (props: any) => <UISeparator {...props} />;
const Dropdown = ({ toggle, isOpen, onSelect, onOpenChange, popperProps, children, ...props }: any) => {
  const trigger = typeof toggle === "function" ? toggle((node: HTMLElement | null) => node) : toggle;
  return (
    <UIDropdownMenu open={isOpen} onOpenChange={(open: boolean) => onOpenChange?.(open)}>
      <UIDropdownMenuTrigger asChild>{trigger}</UIDropdownMenuTrigger>
      <UIDropdownMenuContent>{children}</UIDropdownMenuContent>
    </UIDropdownMenu>
  );
};
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const DropdownList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);

export const HelpHeader = () => {
  const [open, setOpen] = useState(false);
  const help = useHelp();
  const { t } = useTranslation();

  const dropdownItems = [
    <DropdownItem key="link" id="link">
      <FormattedLink
        data-testId="documentation-link"
        href={helpUrls.documentationUrl}
        title={t("documentation")}
      />
    </DropdownItem>,
    <Divider key="divide" />,
    <DropdownItem key="enable" id="enable" description={t("helpToggleInfo")}>
      <Split>
        <SplitItem isFilled>{t("enableHelpMode")}</SplitItem>
        <SplitItem>
          <Switch
            id="enableHelp"
            aria-label={t("enableHelp")}
            isChecked={help.enabled}
            label=""
            className="keycloak_help-header-switch"
            onChange={() => help.toggleHelp()}
          />
        </SplitItem>
      </Split>
    </DropdownItem>,
  ];
  return (
    <Dropdown
      popperProps={{
        position: "right",
      }}
      onOpenChange={(isOpen) => setOpen(isOpen)}
      isOpen={open}
      toggle={(ref) => (
        <MenuToggle
          ref={ref}
          variant="plain"
          onClick={() => setOpen(!open)}
          aria-label="Help"
          id="help"
          data-testid="help-toggle"
        >
          <HelpIcon />
        </MenuToggle>
      )}
    >
      <DropdownList>{dropdownItems}</DropdownList>
    </Dropdown>
  );
};
