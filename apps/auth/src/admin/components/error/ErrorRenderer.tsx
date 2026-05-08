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
import {
  Alert,
  AlertActionLink,
  AlertVariant,
  PageSection,
} from "../../../shared/@patternfly/react-core";
import { useTranslation } from "react-i18next";

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
