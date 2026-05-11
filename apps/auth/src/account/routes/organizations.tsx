/* eslint-disable */
// @ts-nocheck

import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import {
  ErrorBoundaryProvider,
  ListEmptyState,
  OrganizationTable,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { createFileRoute } from "@tanstack/react-router";
import { OrganizationsLoading } from "./-loading/organizations";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AccountEnvironment } from "..";
import { getUserOrganizations } from "../lib/api/methods";
import { Page } from "../components/Page";
import { usePromise } from "../lib/usePromise";

export const Route = createFileRoute("/organizations")({
  component: Organizations,
});

function Organizations() {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();

  const [userOrgs, setUserOrgs] = useState<OrganizationRepresentation[]>([]);

  usePromise(
    (signal) => getUserOrganizations({ signal, context }),
    setUserOrgs,
  );

  if (!userOrgs) {
    return <OrganizationsLoading />;
  }

  return (
    <Page title={t("organizations")} description={t("organizationDescription")}>
      <ErrorBoundaryProvider>
        <OrganizationTable
          link={({ children }) => <span>{children}</span>}
          loader={userOrgs}
        >
          <ListEmptyState
            message={t("emptyUserOrganizations")}
            instructions={t("emptyUserOrganizationsInstructions")}
          />
        </OrganizationTable>
      </ErrorBoundaryProvider>
    </Page>
  );
}
