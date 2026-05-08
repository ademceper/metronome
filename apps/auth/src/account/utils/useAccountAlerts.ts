/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/utils/useAccountAlerts.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useAlerts } from "../../shared/keycloak-ui-shared";
import { AlertVariant } from "../../shared/@patternfly/react-core";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ApiError } from "../api/parse-response";

export function useAccountAlerts() {
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const addAccountError = useCallback(
    (messageKey: string, error: unknown) => {
      if (!(error instanceof ApiError)) {
        addError(messageKey, error);
        return;
      }

      const message = t(messageKey, { error: error.message });
      addAlert(message, AlertVariant.danger, error.description);
    },
    [addAlert, addError, t],
  );

  return useMemo(
    () => ({ addAlert, addError: addAccountError }),
    [addAccountError, addAlert],
  );
}
