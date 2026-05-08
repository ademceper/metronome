/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/context/group-resource/GroupResourceContext.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  createNamedContext,
  useRequiredContext,
} from "../../../shared/keycloak-ui-shared";
import { Groups } from "@keycloak/keycloak-admin-client";
import { PropsWithChildren } from "react";

export const GroupsResourceContext = createNamedContext<Groups | undefined>(
  "GroupsResourceContext",
  undefined,
);

export const useGroupResource = () => useRequiredContext(GroupsResourceContext);

type GroupsContextProps = PropsWithChildren & {
  value: Groups;
};
export const GroupResourceContext = ({
  value,
  children,
}: GroupsContextProps) => {
  return (
    <GroupsResourceContext.Provider value={value}>
      {children}
    </GroupsResourceContext.Provider>
  );
};
