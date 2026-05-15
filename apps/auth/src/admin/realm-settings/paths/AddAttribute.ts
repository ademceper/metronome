// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AddAttributeParams = {
  realm: string;
};
export const AddAttributeRoute = {
  path: "/:realm/realm-settings/user-profile/attributes/add-attribute",
  handle: {
    access: "manage-realm",
  },
};

export const toAddAttribute = (params: AddAttributeParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddAttributeRoute.path, params),
});
