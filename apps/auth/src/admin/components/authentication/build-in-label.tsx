/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/BuildInLabel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next";

const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);

export const BuildInLabel = () => {
  const { t } = useTranslation();

  return (
    <Label icon={<CheckCircleIcon className={""} />}>
      {t("buildIn")}
    </Label>
  );
};
