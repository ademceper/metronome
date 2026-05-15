// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type PolicyDetailsParams = {
  realm: string;
  id: string;
  policyId: string;
  policyType: string;
};
export const PolicyDetailsRoute = {
  path: "/:realm/clients/:id/authorization/policy/:policyId/:policyType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPolicyDetails = (
  params: PolicyDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PolicyDetailsRoute.path, params),
});
