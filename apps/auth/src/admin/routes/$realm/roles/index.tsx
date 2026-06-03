// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { cn } from "@metronome/ui/lib/utils";
import { useAdminClient } from "../../../admin-client";
import { RolesList } from "../../../components/roles-list/roles-list";
import { ViewHeader } from "../../../components/view-header/view-header";
import { useAccess } from "../../../context/access/access";
import { useRealm } from "../../../context/realm-context/realm-context";
import helpUrls from "../../../help-urls";
import { toAddRole } from "../../../lib/realm-roles";
import { toRealmRole } from "../../../lib/realm-roles";

const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

function RealmRolesSection() {
  const { adminClient } = useAdminClient();

  const { realm } = useRealm();
  const { hasAccess } = useAccess();
  const isManager = hasAccess("manage-realm");

  const loader = (first?: number, max?: number, search?: string) => {
    const params: { [name: string]: string | number } = {
      first: first!,
      max: max!,
    };

    const searchParam = search || "";

    if (searchParam) {
      params.search = searchParam;
    }

    return adminClient.roles.find(params);
  };

  return (
    <>
      <ViewHeader
        titleKey="titleRoles"
        subKey="roleExplain"
        helpUrl={helpUrls.realmRolesUrl}
      />
      <PageSection variant="light" padding={{ default: "noPadding" }}>
        <RolesList
          loader={loader}
          toCreate={toAddRole({ realm })}
          toDetail={(roleId) =>
            toRealmRole({ realm, id: roleId, tab: "details" })
          }
          isReadOnly={!isManager}
        />
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/roles/")({
  component: RealmRolesSection,
})
