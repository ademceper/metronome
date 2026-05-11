/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/alerts/AlertPanel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { cn } from "@metronome/ui/lib/utils";
import type { AlertEntry } from "./Alerts";


const AlertGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
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
const AlertActionCloseButton = ({ onClose, ...props }: any) => (
  <button type="button" onClick={onClose} className="ml-auto text-sm underline-offset-4 hover:underline" {...props}>Close</button>
);

export type AlertPanelProps = {
  alerts: AlertEntry[];
  onCloseAlert: (id: number) => void;
};

export function AlertPanel({ alerts, onCloseAlert }: AlertPanelProps) {
  return (
    <AlertGroup
      data-testid="global-alerts"
      isToast
      style={{ whiteSpace: "pre-wrap" }}
    >
      {alerts.map(({ id, variant, message, description }, index) => (
        <Alert
          key={id}
          data-testid={index === 0 ? "last-alert" : undefined}
          isLiveRegion
          variant={AlertVariant[variant]}
          component="p"
          variantLabel=""
          title={message}
          actionClose={
            <AlertActionCloseButton
              title={message}
              onClose={() => onCloseAlert(id)}
            />
          }
        >
          {description && <p>{description}</p>}
        </Alert>
      ))}
    </AlertGroup>
  );
}
