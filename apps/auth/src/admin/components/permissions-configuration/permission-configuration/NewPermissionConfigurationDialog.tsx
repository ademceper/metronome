/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/permission-configuration/NewPermissionConfigurationDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { ResourceTypesRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/resourceServerRepresentation";
import { useTranslation } from "react-i18next";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table";


const Modal = ({ isOpen, onClose, title, description, variant, actions, header, footer, children, ...props }: any) => (
  <UIDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
    <UIDialogContent {...props}>
      {(title || header) ? (
        <UIDialogHeader>
          {title ? <UIDialogTitle>{title}</UIDialogTitle> : null}
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          {header}
        </UIDialogHeader>
      ) : null}
      {children}
      {(actions || footer) ? (
        <UIDialogFooter>
          {actions}
          {footer}
        </UIDialogFooter>
      ) : null}
    </UIDialogContent>
  </UIDialog>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;
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

type NewPermissionConfigurationDialogProps = {
  resourceTypes?: ResourceTypesRepresentation[];
  toggleDialog: () => void;
  onSelect: (resourceType: ResourceTypesRepresentation) => void;
};

export const NewPermissionConfigurationDialog = ({
  resourceTypes,
  onSelect,
  toggleDialog,
}: NewPermissionConfigurationDialogProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      aria-label={t("createPermission")}
      variant={ModalVariant.medium}
      header={
        <TextContent>
          <Text component={TextVariants.h1}>{t("chooseAResourceType")}</Text>
          <Alert
            variant="info"
            isInline
            title={t("chooseAResourceTypeInstructions")}
            component="p"
          />
        </TextContent>
      }
      isOpen
      onClose={toggleDialog}
    >
      <Table aria-label={t("permissions")} variant="compact">
        <Thead>
          <Tr>
            <Th>{t("resourceType")}</Th>
            <Th>{t("description")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(resourceTypes || {}).map((key: any) => {
            const resourceType = resourceTypes![key];
            return (
              <Tr
                key={resourceType.type}
                data-testid={resourceType.type}
                onRowClick={() => {
                  onSelect(resourceType);
                }}
                isClickable
              >
                <Td>{resourceType.type}</Td>
                <Td style={{ textWrap: "wrap" }}>
                  {t(`resourceType.${resourceType.type}`)}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Modal>
  );
};
