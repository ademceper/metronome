/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/NewPolicyDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useTranslation } from "react-i18next";
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

import type PolicyProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyProviderRepresentation";
import { isValidComponentType } from "./policy/PolicyDetails";
import { useMemo } from "react";
import useLocaleSort, { mapByKey } from "../../../utils/useLocaleSort";


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

type NewPolicyDialogProps = {
  policyProviders?: PolicyProviderRepresentation[];
  toggleDialog: () => void;
  onSelect: (provider: PolicyProviderRepresentation) => void;
};

export const NewPolicyDialog = ({
  policyProviders,
  onSelect,
  toggleDialog,
}: NewPolicyDialogProps) => {
  const { t } = useTranslation();
  const localeSort = useLocaleSort();

  const sortedPolicies = useMemo(
    () =>
      policyProviders ? localeSort(policyProviders, mapByKey("name")) : [],
    [policyProviders],
  );

  return (
    <Modal
      aria-label={t("createPolicy")}
      variant={ModalVariant.medium}
      header={
        <TextContent>
          <Text component={TextVariants.h1}>{t("chooseAPolicyType")}</Text>
          <Text>{t("chooseAPolicyTypeInstructions")}</Text>
        </TextContent>
      }
      isOpen
      onClose={toggleDialog}
    >
      <Table aria-label={t("policies")} variant="compact">
        <Thead>
          <Tr>
            <Th>{t("name")}</Th>
            <Th>{t("description")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedPolicies.map((provider) => (
            <Tr
              key={provider.type}
              data-testid={provider.type}
              onRowClick={() => onSelect(provider)}
              isClickable
            >
              <Td>{provider.name}</Td>
              <Td style={{ textWrap: "wrap" }}>
                {isValidComponentType(provider.type!)
                  ? t(`policyProvider.${provider.type}`)
                  : provider.description}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Modal>
  );
};
