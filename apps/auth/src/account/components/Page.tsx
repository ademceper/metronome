/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/components/page/Page.tsx" --revert
 */

import * as React from "react";
import { cn } from "@metronome/ui/lib/utils";
import { PropsWithChildren } from "react";

const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
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

type PageProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export const Page = ({
  title,
  description,
  action,
  children,
}: PropsWithChildren<PageProps>) => {
  return (
    <>
      <PageSection variant="light">
        <div className="flex items-center justify-between gap-4">
          <TextContent>
            <Title headingLevel="h1" data-testid="page-heading">
              {title}
            </Title>
            <Text component="p">{description}</Text>
          </TextContent>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </PageSection>
      <PageSection variant="light">{children}</PageSection>
    </>
  );
};
