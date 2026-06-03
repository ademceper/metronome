/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/advanced/OpenIdVerifiableCredentials.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { FormAccess } from "../../form/form-access";
import { convertAttributeNameToForm } from "../../../util";
import { FormFields, SaveOptions } from "../client-details";
import ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import { DefaultSwitchControl } from "../../switch-control";


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
const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);

type OpenIdVerifiableCredentialsProps = {
  client: ClientRepresentation;
  save: (options?: SaveOptions) => void;
  reset: () => void;
};

export const OpenIdVerifiableCredentials = ({
  save,
  reset,
}: OpenIdVerifiableCredentialsProps) => {
  const { t } = useTranslation();

  return (
    <FormAccess role="manage-clients" isHorizontal>
      <DefaultSwitchControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.oid4vci.enabled",
        )}
        label={t("oid4vciEnabled")}
        labelIcon={t("oid4vciEnabledHelp")}
        stringify
      />
      <ActionGroup>
        <Button
          variant="secondary"
          id="oid4vciSave"
          data-testid="oid4vciSave"
          onClick={() => save()}
        >
          {t("save")}
        </Button>
        <Button
          id="oid4vciRevert"
          data-testid="oid4vciRevert"
          variant="link"
          onClick={reset}
        >
          {t("revert")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
