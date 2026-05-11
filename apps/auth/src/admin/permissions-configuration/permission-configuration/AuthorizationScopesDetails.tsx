/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/permission-configuration/AuthorizationScopesDetails.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useTranslation } from "react-i18next";
import { capitalize } from "lodash-es";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@metronome/ui/components/popover";
import { cn } from "@metronome/ui/lib/utils";

const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const LabelGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-wrap items-center gap-1", className)} {...props}>{children}</div>
);
const Popover = ({ bodyContent, headerContent, footerContent, children, position, ...props }: any) => (
  <UIPopover {...props}>
    <UIPopoverTrigger asChild>{children}</UIPopoverTrigger>
    <UIPopoverContent>
      {headerContent ? (
        <div className="font-medium text-sm">{typeof headerContent === "function" ? headerContent() : headerContent}</div>
      ) : null}
      {bodyContent ? (
        <div className="text-sm">{typeof bodyContent === "function" ? bodyContent() : bodyContent}</div>
      ) : null}
      {footerContent ? (
        <div className="pt-2 text-sm">{typeof footerContent === "function" ? footerContent() : footerContent}</div>
      ) : null}
    </UIPopoverContent>
  </UIPopover>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextList = ({ component = "ul", children, ...props }: any) =>
  React.createElement(component, {
    className: cn(component === "ol" ? "list-decimal pl-5" : component === "dl" ? "" : "list-disc pl-5", "space-y-1 text-sm"),
    ...props,
  }, children);
const TextListItem = ({ component = "li", children, ...props }: any) =>
  React.createElement(component, props, children);
const TextListItemVariants = { li: "li", dt: "dt", dd: "dd" } as const;
const TextListVariants = { ul: "ul", ol: "ol", dl: "dl" } as const;

type AuthorizationScopesDetailsProps = {
  row: {
    resourceType: string;
    associatedScopes?: { name: string }[];
  };
};

export const AuthorizationScopesDetails = ({
  row,
}: AuthorizationScopesDetailsProps) => {
  const { t } = useTranslation();

  const associatedScopes = row.associatedScopes || [];

  return (
    <LabelGroup>
      {associatedScopes.map((scope, index) => (
        <Popover
          key={index}
          aria-label={`Authorization scope popover for ${scope.name}`}
          position="top"
          hasAutoWidth
          bodyContent={
            <TextContent>
              <Text className="pf-v5-u-font-size-md pf-v5-u-font-weight-bold">
                {t("authorizationScopeDetailsTitle")}
              </Text>
              <Text className="pf-v5-u-font-size-sm">
                {t("authorizationScopeDetailsSubtitle")}
              </Text>
              <TextList
                component={TextListVariants.dl}
                className="pf-v5-u-font-size-sm"
              >
                <TextListItem component={TextListItemVariants.dt}>
                  {t("authorizationScopeDetailsName")}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {capitalize(scope.name)}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  {t("authorizationScopeDetailsDescription")}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {" "}
                  {t(`authorizationScope.${row.resourceType}.${scope.name}`)}
                </TextListItem>
              </TextList>
            </TextContent>
          }
        >
          <Label color="blue">{capitalize(scope.name)}</Label>
        </Popover>
      ))}
    </LabelGroup>
  );
};
