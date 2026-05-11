import {
  ErrorBoundaryProvider,
  ListEmptyState,
  OrganizationTable,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { OrganizationsLoading } from "./-loading/organizations";
import { useTranslation } from "react-i18next";
import { AccountEnvironment } from "..";
import { getUserOrganizations } from "../lib/api/methods";
import { Page } from "../components/Page";

export const Route = createFileRoute("/organizations")({
  component: Organizations,
});

function Organizations() {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();

  const { data: userOrgs, isPending } = useQuery({
    queryKey: ["account", "userOrganizations"],
    queryFn: ({ signal }) => getUserOrganizations({ signal, context }),
  });

  if (isPending || !userOrgs) {
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
