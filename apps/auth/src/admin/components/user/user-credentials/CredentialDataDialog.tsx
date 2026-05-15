/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/user-credentials/CredentialDataDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
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

const TableVariant = { compact: undefined, default: undefined } as any;

type CredentialDataDialogProps = {
  title: string;
  credentialData: [string, string][];
  onClose: () => void;
};

export const CredentialDataDialog = ({
  title,
  credentialData,
  onClose,
}: CredentialDataDialogProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      variant={ModalVariant.medium}
      title={title}
      data-testid="passwordDataDialog"
      isOpen
      onClose={onClose}
    >
      <Table
        aria-label={title}
        data-testid="password-data-dialog"
        variant={TableVariant.compact}
      >
        <Thead>
          <Tr>
            <Th>{t("showPasswordDataName")}</Th>
            <Th>{t("showPasswordDataValue")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {credentialData.map((cred, index) => {
            return (
              <Tr key={index}>
                <Td>{cred[0]}</Td>
                <Td>{cred[1]}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Modal>
  );
};
