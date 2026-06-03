/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/error/ErrorRenderer.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { NetworkError } from "@keycloak/keycloak-admin-client";
import {
  useEnvironment,
  type FallbackProps,
} from "../../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";


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
const AlertActionLink = ({ children, ...props }: any) => (
  <a className="text-sm underline-offset-4 hover:underline" {...props}>{children}</a>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export const ErrorRenderer = ({ error }: FallbackProps) => {
  const { keycloak } = useEnvironment();
  const { t } = useTranslation();
  const isPermissionError =
    error instanceof NetworkError && error.response.status === 403;

  let message;
  if (isPermissionError) {
    message = t("forbiddenAdminConsole");
  } else {
    message = error.message;
  }

  return (
    <PageSection>
      <Alert
        isInline
        variant={AlertVariant.danger}
        title={message}
        actionLinks={
          isPermissionError ? (
            <AlertActionLink onClick={async () => await keycloak.logout()}>
              {t("signOut")}
            </AlertActionLink>
          ) : (
            <AlertActionLink onClick={() => location.reload()}>
              {t("reload")}
            </AlertActionLink>
          )
        }
      ></Alert>
    </PageSection>
  );
};
