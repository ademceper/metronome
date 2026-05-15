// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type EditClientPolicyParams = {
  realm: string;
  policyName: string;
};
export const EditClientPolicyRoute = {
  path: "/:realm/realm-settings/client-policies/:policyName/edit-policy",
  handle: {
    access: "manage-realm",
  },
};

export const toEditClientPolicy = (
  params: EditClientPolicyParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditClientPolicyRoute.path, params),
});
