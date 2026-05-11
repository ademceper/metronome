/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/KeycloakSpinner.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";


const Bullseye = ({ children, className, ...props }: any) => (
  <div className={cn("flex h-full w-full items-center justify-center", className)} {...props}>{children}</div>
);
const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;

export const KeycloakSpinner = () => {
  const { t } = useTranslation();

  return (
    <Bullseye>
      <Spinner aria-label={t("spinnerLoading")} />
    </Bullseye>
  );
};
