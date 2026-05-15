// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewAttributesGroupParams = {
  realm: string;
};
export const NewAttributesGroupRoute = {
  path: "/:realm/realm-settings/user-profile/attributesGroup/new",
  handle: {
    access: "view-realm",
  },
};

export const toNewAttributesGroup = (
  params: NewAttributesGroupParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewAttributesGroupRoute.path, params),
});
