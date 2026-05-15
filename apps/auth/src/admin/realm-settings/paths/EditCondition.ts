// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type EditClientPolicyConditionParams = {
  realm: string;
  policyName: string;
  conditionName: string;
};
export const EditClientPolicyConditionRoute = {
  path: "/:realm/realm-settings/client-policies/:policyName/edit-policy/:conditionName/edit-condition",
  handle: {
    access: "manage-clients",
  },
};

export const toEditClientPolicyCondition = (
  params: EditClientPolicyConditionParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditClientPolicyConditionRoute.path, params),
});
