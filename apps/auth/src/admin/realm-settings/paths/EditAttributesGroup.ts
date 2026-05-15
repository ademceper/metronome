// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type EditAttributesGroupParams = {
  realm: string;
  name: string;
};
export const EditAttributesGroupRoute = {
  path: "/:realm/realm-settings/user-profile/attributesGroup/edit/:name",
  handle: {
    access: "view-realm",
  },
};

export const toEditAttributesGroup = (
  params: EditAttributesGroupParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditAttributesGroupRoute.path, params),
});
