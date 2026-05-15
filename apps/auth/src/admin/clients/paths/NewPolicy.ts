// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewPolicyParams = { realm: string; id: string; policyType: string };
export const NewPolicyRoute = {
  path: "/:realm/clients/:id/authorization/policy/new/:policyType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toCreatePolicy = (params: NewPolicyParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewPolicyRoute.path, params),
});
