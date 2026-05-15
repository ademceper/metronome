// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AttributeParams = {
  realm: string;
  attributeName: string;
};
export const AttributeRoute = {
  path: "/:realm/realm-settings/user-profile/attributes/:attributeName/edit-attribute",
  handle: {
    access: "manage-realm",
  },
};

export const toAttribute = (params: AttributeParams): Partial<Path> => ({
  pathname: generateEncodedPath(AttributeRoute.path, params),
});
