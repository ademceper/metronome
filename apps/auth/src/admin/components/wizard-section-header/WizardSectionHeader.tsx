/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/wizard-section-header/WizardSectionHeader.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { cn } from "@metronome/ui/lib/utils";

const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TitleSizes = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;
const Title = ({ headingLevel = "h1", size, children, className, ...props }: any) =>
  React.createElement(headingLevel, {
    className: cn("font-heading font-medium", (TitleSizes as any)[size as string] ?? "text-base", className),
    ...props,
  }, children);

export type WizardSectionHeaderProps = {
  title: string;
  description?: string;
  showDescription?: boolean;
};

export const WizardSectionHeader = ({
  title,
  description,
  showDescription = false,
}: WizardSectionHeaderProps) => {
  return (
    <>
      <Title
        size={"xl"}
        headingLevel={"h2"}
        className={
          showDescription
            ? "kc-wizard-section-header__title--has-description"
            : "kc-wizard-section-header__title"
        }
      >
        {title}
      </Title>
      {showDescription && (
        <TextContent className="kc-wizard-section-header__description">
          <Text>{description}</Text>
        </TextContent>
      )}
    </>
  );
};
