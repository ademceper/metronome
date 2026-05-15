// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AddClientPolicyParams = { realm: string };
export const AddClientPolicyRoute = {
  path: "/:realm/realm-settings/client-policies/policies/add-client-policy",
  handle: {
    access: "manage-clients",
  },
};

export const toAddClientPolicy = (
  params: AddClientPolicyParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(AddClientPolicyRoute.path, params),
});
