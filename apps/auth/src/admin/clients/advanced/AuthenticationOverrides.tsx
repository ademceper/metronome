/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/advanced/AuthenticationOverrides.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import AuthenticationFlowRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticationFlowRepresentation";
import { SelectControl, useFetch } from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { sortBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { FormAccess } from "../../components/form/FormAccess";


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
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

type AuthenticationOverridesProps = {
  save: () => void;
  reset: () => void;
  protocol?: string;
  hasConfigureAccess?: boolean;
};

export const AuthenticationOverrides = ({
  protocol,
  save,
  reset,
  hasConfigureAccess,
}: AuthenticationOverridesProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const [flows, setFlows] = useState<AuthenticationFlowRepresentation[]>([]);

  useFetch(
    () => adminClient.authenticationManagement.getFlows(),
    (flows) => {
      let filteredFlows = [
        ...flows.filter((flow) => flow.providerId !== "client-flow"),
      ];
      filteredFlows = sortBy(filteredFlows, [(f) => f.alias]);
      setFlows(filteredFlows);
    },
    [],
  );

  return (
    <FormAccess
      role="manage-clients"
      fineGrainedAccess={hasConfigureAccess}
      isHorizontal
    >
      <SelectControl
        name="authenticationFlowBindingOverrides.browser"
        label={t("browserFlow")}
        labelIcon={t("browserFlowHelp")}
        controller={{
          defaultValue: "",
        }}
        options={[
          { key: "", value: t("choose") },
          ...flows.map(({ id, alias }) => ({ key: id!, value: alias! })),
        ]}
      />
      {protocol === "openid-connect" && (
        <SelectControl
          name="authenticationFlowBindingOverrides.direct_grant"
          label={t("directGrant")}
          labelIcon={t("directGrantHelp")}
          controller={{
            defaultValue: "",
          }}
          options={[
            { key: "", value: t("choose") },
            ...flows.map(({ id, alias }) => ({ key: id!, value: alias! })),
          ]}
        />
      )}
      <ActionGroup>
        <Button
          variant="secondary"
          onClick={save}
          data-testid="OIDCAuthFlowOverrideSave"
        >
          {t("save")}
        </Button>
        <Button
          variant="link"
          onClick={reset}
          data-testid="OIDCAuthFlowOverrideRevert"
        >
          {t("revert")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
