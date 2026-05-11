/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/view-header/ViewHeader.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import {
  ReactElement,
  ReactNode,
  useState,
  isValidElement,
  Fragment,
} from "react";
import { useTranslation } from "react-i18next";
import { FormattedLink } from "../external-link/FormattedLink";
import { useHelp, HelpItem } from "../../../shared/keycloak-ui-shared";

const Badge = ({ isRead, ...props }: any) => <UIBadge {...props} />;
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
const DropdownList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Level = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center justify-between gap-2", className)} {...props}>{children}</div>
);
const LevelItem = ({ children, className, ...props }: any) => (
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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const Toolbar = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const ToolbarContent = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>{children}</div>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

import "../../help-urls";

export type ViewHeaderProps = {
  titleKey: string;
  className?: string;
  badges?: ViewHeaderBadge[];
  isDropdownDisabled?: boolean;
  subKey?: string | ReactNode;
  actionsDropdownId?: string;
  helpUrl?: string | undefined;
  dropdownItems?: ReactElement[];
  lowerDropdownItems?: any;
  lowerDropdownMenuTitle?: any;
  lowerButton?: any;
  isEnabled?: boolean;
  onToggle?: (value: boolean) => void;
  divider?: boolean;
  helpTextKey?: string;
  isReadOnly?: boolean;
  actionDropdownTitle?: string;
};

export type ViewHeaderBadge = {
  id?: string;
  text?: string | ReactNode;
  readonly?: boolean;
};

export const ViewHeader = ({
  actionsDropdownId,
  className,
  titleKey,
  badges,
  isDropdownDisabled,
  subKey,
  helpUrl,
  dropdownItems,
  lowerDropdownMenuTitle,
  lowerDropdownItems,
  lowerButton,
  isEnabled = true,
  onToggle,
  divider = true,
  helpTextKey,
  isReadOnly = false,
  actionDropdownTitle = "action",
}: ViewHeaderProps) => {
  const { t, i18n } = useTranslation();
  const { enabled } = useHelp();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLowerDropdownOpen, setIsLowerDropdownOpen] = useState(false);

  const onDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const onLowerDropdownToggle = () => {
    setIsLowerDropdownOpen(!isLowerDropdownOpen);
  };

  const toKey = (value: string) => value.replace(/\s/g, "-");

  return (
    <>
      <PageSection variant="light">
        <Level hasGutter>
          <LevelItem>
            <Level>
              <LevelItem>
                <TextContent className="pf-v5-u-mr-sm">
                  <Text
                    className={className}
                    component="h1"
                    data-testid="view-header"
                  >
                    {i18n.exists(titleKey) ? t(titleKey) : titleKey}
                  </Text>
                </TextContent>
              </LevelItem>
              {badges && (
                <LevelItem>
                  {badges.map((badge, index) => (
                    <Fragment key={index}>
                      {!isValidElement(badge.text) && (
                        <Fragment key={badge.text as string}>
                          <Badge data-testid={badge.id} isRead={badge.readonly}>
                            {badge.text}
                          </Badge>{" "}
                        </Fragment>
                      )}
                      {isValidElement(badge.text) && badge.text}{" "}
                    </Fragment>
                  ))}
                </LevelItem>
              )}
            </Level>
          </LevelItem>
          <LevelItem>
            <Toolbar className="pf-v5-u-p-0">
              <ToolbarContent>
                {onToggle && (
                  <ToolbarItem alignSelf="center">
                    <Switch
                      id={`${toKey(titleKey)}-switch`}
                      data-testid={`${titleKey}-switch`}
                      label={t("enabled")}
                      labelOff={t("disabled")}
                      className="pf-v5-u-mr-lg"
                      isDisabled={isReadOnly}
                      isChecked={isEnabled}
                      aria-label={t("enabled")}
                      onChange={(_event, value) => {
                        onToggle(value);
                      }}
                    />
                    {helpTextKey && (
                      <HelpItem
                        helpText={t(helpTextKey)}
                        fieldLabelId={`${toKey(titleKey)}-switch`}
                      />
                    )}
                  </ToolbarItem>
                )}
                {dropdownItems && (
                  <ToolbarItem>
                    <Dropdown
                      popperProps={{
                        position: "right",
                      }}
                      onOpenChange={onDropdownToggle}
                      toggle={(ref) => (
                        <MenuToggle
                          ref={ref}
                          isDisabled={isDropdownDisabled}
                          id={actionsDropdownId}
                          onClick={onDropdownToggle}
                          data-testid="action-dropdown"
                        >
                          {t(actionDropdownTitle)}
                        </MenuToggle>
                      )}
                      isOpen={isDropdownOpen}
                    >
                      <DropdownList>{dropdownItems}</DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                )}
              </ToolbarContent>
            </Toolbar>
          </LevelItem>
        </Level>
        {enabled && (
          <TextContent id="view-header-subkey">
            <Text>
              {isValidElement(subKey)
                ? subKey
                : subKey
                  ? t(subKey as string)
                  : ""}
              {helpUrl && (
                <FormattedLink
                  title={t("learnMore")}
                  href={helpUrl}
                  isInline
                  className="pf-v5-u-ml-md"
                />
              )}
            </Text>
          </TextContent>
        )}
        {lowerDropdownItems && (
          <Dropdown
            className="keycloak__user-federation__dropdown"
            onOpenChange={onLowerDropdownToggle}
            toggle={(ref) => (
              <MenuToggle
                ref={ref}
                onClick={onLowerDropdownToggle}
                variant="primary"
                id="ufToggleId"
              >
                {t(lowerDropdownMenuTitle)}
              </MenuToggle>
            )}
            isOpen={isLowerDropdownOpen}
          >
            <DropdownList>{lowerDropdownItems}</DropdownList>
          </Dropdown>
        )}
        {lowerButton && (
          <Button
            variant={lowerButton.variant}
            onClick={lowerButton.onClick}
            data-testid="viewHeader-lower-btn"
          >
            {lowerButton.lowerButtonTitle}
          </Button>
        )}
      </PageSection>
      {divider && <Divider component="div" />}
    </>
  );
};
