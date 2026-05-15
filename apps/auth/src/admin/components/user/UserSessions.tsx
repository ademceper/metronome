/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/UserSessions.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { useRealm } from "../../context/realm-context/RealmContext";
import SessionsTable from "../sessions/SessionsTable";
import { useParams } from "../../utils/useParams";
import type { UserParams } from "../../lib/user";


const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export const UserSessions = () => {
  const { adminClient } = useAdminClient();

  const { id } = useParams<UserParams>();
  const { realm } = useRealm();
  const { t } = useTranslation();

  const loader = () => adminClient.users.listSessions({ id, realm });

  return (
    <PageSection variant="light" className="pf-v5-u-p-0">
      <SessionsTable
        loader={loader}
        hiddenColumns={["username", "type"]}
        emptyInstructions={t("noSessionsForUser")}
        logoutUser={id}
      />
    </PageSection>
  );
};
