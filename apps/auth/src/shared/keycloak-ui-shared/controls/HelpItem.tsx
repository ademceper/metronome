/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/HelpItem.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@metronome/ui/components/popover";
import { cn } from "@metronome/ui/lib/utils";
import { Question as HelpIcon, Warning as ExclamationTriangleIcon } from "@phosphor-icons/react"
import { ReactNode } from "react";
import { useHelp } from "../context/HelpContext";


const Icon = ({ size, status, children, className, ...props }: any) => (
  <span className={cn("inline-flex items-center justify-center", className)} {...props}>{children}</span>
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

type HelpItemProps = {
  helpText: string | ReactNode;
  fieldLabelId: string;
  noVerticalAlign?: boolean;
  unWrap?: boolean;
  isRecommendation?: boolean;
};

export const HelpItem = ({
  helpText,
  fieldLabelId,
  noVerticalAlign = true,
  unWrap = false,
  isRecommendation = false,
}: HelpItemProps) => {
  const { enabled } = useHelp();
  const IconComponent = isRecommendation ? ExclamationTriangleIcon : HelpIcon;

  return enabled ? (
    <Popover bodyContent={helpText}>
      <>
        {!unWrap && (
          <button
            data-testid={`help-label-${fieldLabelId}`}
            aria-label={fieldLabelId}
            onClick={(e) => e.preventDefault()}
            className="pf-v5-c-form__group-label-help"
          >
            <Icon
              isInline={noVerticalAlign}
              status={isRecommendation ? "warning" : undefined}
            >
              <IconComponent />
            </Icon>
          </button>
        )}
        {unWrap && (
          <Icon
            isInline={noVerticalAlign}
            status={isRecommendation ? "warning" : undefined}
          >
            <IconComponent />
          </Icon>
        )}
      </>
    </Popover>
  ) : null;
};
