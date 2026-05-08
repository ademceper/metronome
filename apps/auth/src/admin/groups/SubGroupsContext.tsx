/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/SubGroupsContext.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { PropsWithChildren, useState } from "react";
import {
  createNamedContext,
  useRequiredContext,
} from "../../shared/keycloak-ui-shared";

type SubGroupsProps = {
  subGroups: GroupRepresentation[];
  setSubGroups: (group: GroupRepresentation[]) => void;
  clear: () => void;
  remove: (group: GroupRepresentation) => void;
  currentGroup: () => GroupRepresentation | undefined;
};

const SubGroupsContext = createNamedContext<SubGroupsProps | undefined>(
  "SubGroupsContext",
  undefined,
);

export const SubGroups = ({ children }: PropsWithChildren) => {
  const [subGroups, setSubGroups] = useState<GroupRepresentation[]>([]);

  const clear = () => setSubGroups([]);
  const remove = (group: GroupRepresentation) =>
    setSubGroups(
      subGroups.slice(0, subGroups.findIndex((g) => g.id === group.id) + 1),
    );
  const currentGroup = () => subGroups[subGroups.length - 1];
  return (
    <SubGroupsContext.Provider
      value={{ subGroups, setSubGroups, clear, remove, currentGroup }}
    >
      {children}
    </SubGroupsContext.Provider>
  );
};

export const useSubGroups = () => useRequiredContext(SubGroupsContext);
