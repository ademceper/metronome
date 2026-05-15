// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ClientPoliciesTab = "profiles" | "policies";

export type ClientPoliciesParams = {
  realm: string;
  tab: ClientPoliciesTab;
};
export const ClientPoliciesRoute = {
  path: "/:realm/realm-settings/client-policies/:tab",
  handle: {
    access: "view-realm",
  },
};

export const toClientPolicies = (
  params: ClientPoliciesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientPoliciesRoute.path, params),
});
