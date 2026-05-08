/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/KeycloakSpinner.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Bullseye, Spinner } from "../../@patternfly/react-core";
import { useTranslation } from "react-i18next";

export const KeycloakSpinner = () => {
  const { t } = useTranslation();

  return (
    <Bullseye>
      <Spinner aria-label={t("spinnerLoading")} />
    </Bullseye>
  );
};
