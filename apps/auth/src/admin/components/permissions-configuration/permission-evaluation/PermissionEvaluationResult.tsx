/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/permission-evaluation/PermissionEvaluationResult.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import PolicyEvaluationResponse from "@keycloak/keycloak-admin-client/lib/defs/policyEvaluationResponse";
import { useMemo } from "react";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { sortBy } from "lodash-es";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
const List = ({ variant, children, className, ...props }: any) => (
  <ul className={cn("space-y-1 text-sm", variant === "inline" ? "flex flex-wrap gap-2" : "list-disc pl-5", className)} {...props}>
    {children}
  </ul>
);
const ListItem = ({ children, ...props }: any) => <li {...props}>{children}</li>;
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);

type PermissionEvaluationResultProps = {
  evaluateResult: PolicyEvaluationResponse;
};

export const PermissionEvaluationResult = ({
  evaluateResult,
}: PermissionEvaluationResultProps) => {
  const { t } = useTranslation();
  const evaluatedResults = evaluateResult?.results || [];
  const evaluatedResult = evaluatedResults[0] || {};
  const alertTitle =
    evaluatedResult?.resource?.name ?? t("permissionEvaluationAlertTitle");
  const alertVariant =
    evaluateResult?.status === "PERMIT" ? "success" : "warning";

  const evaluatedAllowedScopes = useMemo(
    () => sortBy(evaluatedResult?.allowedScopes || [], "name"),
    [evaluatedResult],
  );
  const evaluatedDeniedScopes = useMemo(
    () => sortBy(evaluatedResult?.deniedScopes || [], "name"),
    [evaluatedResult],
  );
  const evaluatedPolicies = useMemo(
    () => sortBy(evaluatedResult?.policies || [], "name"),
    [evaluatedResult],
  );

  const evaluatedPermission = function (title: string, status: string) {
    const permissions = evaluatedPolicies.filter((p) => p.status === status);

    if (permissions.length == 0) {
      return;
    }

    return (
      <>
        <Text className="pf-v5-u-pt-sm">
          <strong>{t(title)}</strong>:
        </Text>
        <List className="pf-v5-u-mt-sm">
          {permissions.map((p) => (
            <ListItem key={p.policy?.id}>
              {t("evaluatedPolicy", {
                name: p.policy?.name,
                status: p.status,
              })}
            </ListItem>
          ))}
        </List>
      </>
    );
  };

  return (
    <Alert isInline variant={alertVariant} title={alertTitle} component="h6">
      {evaluatedAllowedScopes.length > 0 && (
        <>
          <Text>
            <b>{t("grantedScope")}</b>
          </Text>
          <List className="pf-v5-u-mt-sm">
            {evaluatedAllowedScopes.map((scope) => (
              <ListItem key={scope.id}>{scope.name}</ListItem>
            ))}
          </List>
        </>
      )}

      {evaluatedDeniedScopes.length > 0 && (
        <>
          <Text className="pf-v5-u-pt-sm">
            <strong>{t("deniedScope")}</strong>
          </Text>

          <List className="pf-v5-u-mt-sm">
            {evaluatedDeniedScopes.map((scope) => (
              <ListItem key={scope.id}>{scope.name}</ListItem>
            ))}
          </List>
        </>
      )}

      {evaluatedPermission("grantedPermissions", "PERMIT")}
      {evaluatedPermission("deniedPermissions", "DENY")}
    </Alert>
  );
};
