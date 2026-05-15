/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/keys/key-providers/KeyProviderModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { useTranslation } from "react-i18next";
import { KeyProviderForm } from "./KeyProviderForm";
import type { ProviderType } from "../../../lib/realm-settings";

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

type KeyProviderModalProps = {
  providerType: ProviderType;
  onClose: () => void;
};

export const KeyProviderModal = ({
  providerType,
  onClose,
}: KeyProviderModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      className={""}
      variant={ModalVariant.medium}
      title={t("addProvider")}
      isOpen
      onClose={onClose}
    >
      <KeyProviderForm providerType={providerType} onClose={onClose} />
    </Modal>
  );
};
