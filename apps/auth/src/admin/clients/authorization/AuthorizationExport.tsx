/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/AuthorizationExport.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ResourceServerRepresentation from "@keycloak/keycloak-admin-client/lib/defs/resourceServerRepresentation";
import {
  KeycloakSpinner,
  useAlerts,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { FormAccess } from "../../components/form/FormAccess";
import { prettyPrintJSON } from "../../util";
import { useParams } from "../../utils/useParams";
import type { ClientParams } from "../routes/Client";


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export const AuthorizationExport = () => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { clientId } = useParams<ClientParams>();
  const { addAlert, addError } = useAlerts();

  const [code, setCode] = useState<string>();
  const [authorizationDetails, setAuthorizationDetails] =
    useState<ResourceServerRepresentation>();

  useFetch(
    () =>
      adminClient.clients.exportResource({
        id: clientId,
      }),

    (authDetails) => {
      setCode(JSON.stringify(authDetails, null, 2));
      setAuthorizationDetails(authDetails);
    },
    [],
  );

  const exportAuthDetails = () => {
    try {
      saveAs(
        new Blob([prettyPrintJSON(authorizationDetails)], {
          type: "application/json",
        }),
        "test-authz-config.json",
      );
      addAlert(t("exportAuthDetailsSuccess"), AlertVariant.success);
    } catch (error) {
      addError("exportAuthDetailsError", error);
    }
  };

  if (!code) {
    return <KeycloakSpinner />;
  }

  return (
    <PageSection>
      <FormAccess
        isHorizontal
        role="manage-authorization"
        className="pf-v5-u-mt-lg"
      >
        <CodeEditor
          data-testid="authorization-export-code-editor"
          value={code!}
          language="json"
          readOnly
          rows={10}
          style={{ height: "30rem", overflow: "scroll" }}
        />
        <ActionGroup>
          <Button
            data-testid="authorization-export-download"
            onClick={() => exportAuthDetails()}
          >
            {t("download")}
          </Button>
          <Button
            data-testid="authorization-export-copy"
            variant="secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code!);
                addAlert(t("copied"), AlertVariant.success);
              } catch (error) {
                addError("copyError", error);
              }
            }}
          >
            {t("copy")}
          </Button>
        </ActionGroup>
      </FormAccess>
    </PageSection>
  );
};
