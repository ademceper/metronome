/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/EmptyExecutionState.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import type AuthenticationFlowRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticationFlowRepresentation";
import type { AuthenticationProviderRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigRepresentation";
import { ListEmptyState } from "../../shared/keycloak-ui-shared";
import { AddStepModal } from "./components/modals/AddStepModal";
import { AddSubFlowModal, Flow } from "./components/modals/AddSubFlowModal";

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
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
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

const SECTIONS = ["addExecution", "addSubFlow"] as const;
type SectionType = (typeof SECTIONS)[number] | undefined;

type EmptyExecutionStateProps = {
  flow: AuthenticationFlowRepresentation;
  onAddExecution: (type: AuthenticationProviderRepresentation) => void;
  onAddFlow: (flow: Flow) => void;
};

export const EmptyExecutionState = ({
  flow,
  onAddExecution,
  onAddFlow,
}: EmptyExecutionStateProps) => {
  const { t } = useTranslation();
  const [show, setShow] = useState<SectionType>();

  return (
    <>
      {show === "addExecution" && (
        <AddStepModal
          name={flow.alias!}
          type={flow.providerId === "client-flow" ? "client" : "basic"}
          onSelect={(type) => {
            if (type) {
              onAddExecution(type);
            }
            setShow(undefined);
          }}
        />
      )}
      {show === "addSubFlow" && (
        <AddSubFlowModal
          name={flow.alias!}
          onCancel={() => setShow(undefined)}
          onConfirm={(newFlow) => {
            onAddFlow(newFlow);
            setShow(undefined);
          }}
        />
      )}
      <ListEmptyState
        message={t("emptyExecution")}
        instructions={t("emptyExecutionInstructions")}
      />

      <div className="keycloak__empty-execution-state__block">
        {SECTIONS.map((section) => (
          <Flex key={section} className="keycloak__empty-execution-state__help">
            <FlexItem flex={{ default: "flex_1" }}>
              <Title headingLevel="h2" size={TitleSizes.md}>
                {t(`${section}Title`)}
              </Title>
              <p>{t(section)}</p>
            </FlexItem>
            <Flex alignSelf={{ default: "alignSelfCenter" }}>
              <FlexItem>
                <Button
                  data-testid={section}
                  variant="tertiary"
                  onClick={() => setShow(section)}
                >
                  {t(section)}
                </Button>
              </FlexItem>
            </Flex>
          </Flex>
        ))}
      </div>
    </>
  );
};
