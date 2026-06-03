/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/keycloak-card/KeycloakCard.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Card as UICard, CardContent as UICardContent, CardFooter as UICardFooter, CardHeader as UICardHeader, CardTitle as UICardTitle } from "@metronome/ui/components/card";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { ReactElement, useState } from "react";
import { Link, To } from "react-router-dom";
import { DotsThreeVertical as EllipsisVIcon } from "@phosphor-icons/react"


const Card = ({ isSelectable, isSelected, isFlat, isCompact, ...props }: any) => (
  <UICard {...props} />
);
const CardBody = (props: any) => <UICardContent {...props} />;
const CardFooter = (props: any) => <UICardFooter {...props} />;
const CardHeader = (props: any) => <UICardHeader {...props} />;
const CardTitle = (props: any) => <UICardTitle {...props} />;
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
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
type MenuToggleElement = HTMLButtonElement;

export type KeycloakCardProps = {
  title: string;
  dropdownItems?: ReactElement[];
  labelText?: string;
  labelColor?: any;
  footerText?: string;
  to: To;
};

export const KeycloakCard = ({
  title,
  dropdownItems,
  labelText,
  labelColor,
  footerText,
  to,
}: KeycloakCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Card isSelectable isClickable>
      <CardHeader
        actions={{
          actions: dropdownItems ? (
            <Dropdown
              popperProps={{
                position: "right",
              }}
              onOpenChange={onDropdownToggle}
              toggle={(ref: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={ref}
                  onClick={onDropdownToggle}
                  variant="plain"
                  data-testid={`${title}-dropdown`}
                >
                  <EllipsisVIcon />
                </MenuToggle>
              )}
              isOpen={isDropdownOpen}
            >
              <DropdownList>{dropdownItems}</DropdownList>
            </Dropdown>
          ) : undefined,
          hasNoOffset: false,
          className: undefined,
        }}
      >
        <CardTitle data-testid="keycloak-card-title">
          <Link to={to}>{title}</Link>
        </CardTitle>
      </CardHeader>
      <CardBody />
      <CardFooter>
        <Flex>
          <FlexItem className="keycloak--keycloak-card__footer">
            {footerText && footerText}
          </FlexItem>
          <FlexItem>
            {labelText && (
              <Label color={labelColor || "gray"}>{labelText}</Label>
            )}
          </FlexItem>
        </Flex>
      </CardFooter>
    </Card>
  );
};
