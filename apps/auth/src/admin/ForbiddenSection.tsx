/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/ForbiddenSection.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { PageSection } from "../shared/@patternfly/react-core";

import type { AccessType } from "@keycloak/keycloak-admin-client/lib/defs/whoAmIRepresentation";

type ForbiddenSectionProps = {
  permissionNeeded: AccessType | AccessType[];
};

export const ForbiddenSection = ({
  permissionNeeded,
}: ForbiddenSectionProps) => {
  const { t } = useTranslation();
  const permissionNeededArray = Array.isArray(permissionNeeded)
    ? permissionNeeded
    : [permissionNeeded];

  return (
    <PageSection>
      {t("forbidden", { count: permissionNeededArray.length })}{" "}
      {permissionNeededArray.map((p) => p.toString()).join(", ")}
    </PageSection>
  );
};
