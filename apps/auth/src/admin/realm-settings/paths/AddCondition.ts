// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewClientPolicyConditionParams = {
  realm: string;
  policyName: string;
};
export const NewClientPolicyConditionRoute = {
  path: "/:realm/realm-settings/client-policies/:policyName/edit-policy/create-condition",
  handle: {
    access: "manage-clients",
  },
};

export const toNewClientPolicyCondition = (
  params: NewClientPolicyConditionParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewClientPolicyConditionRoute.path, params),
});
