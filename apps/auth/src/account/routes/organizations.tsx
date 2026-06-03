import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { ErrorBoundaryProvider, OrganizationTable } from "../../shared/keycloak-ui-shared";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";import { Page } from "../components/page"
import { useUserOrganizations } from "../lib/api"
import { OrganizationsLoading } from "./-loading/organizations"

export const Route = createFileRoute("/organizations")({
  component: Organizations,
})

function Organizations() {
  const { t } = useTranslation()
  const { data: userOrgs, isPending } = useUserOrganizations()

  if (isPending || !userOrgs) {
    return <OrganizationsLoading />
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
  )
}
