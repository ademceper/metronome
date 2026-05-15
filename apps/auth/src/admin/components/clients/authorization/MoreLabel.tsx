/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/MoreLabel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { Badge as UIBadge } from "@metronome/ui/components/badge";

const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);

type MoreLabelProps = {
  array: unknown[] | undefined;
};

export const MoreLabel = ({ array }: MoreLabelProps) => {
  const { t } = useTranslation();

  if (!array || array.length <= 1) {
    return null;
  }
  return <Label color="blue">{t("more", { count: array.length - 1 })}</Label>;
};
