// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type MapperParams = {
  realm: string;
  id: string;
  mapperId: string;
  viewMode: "edit" | "new";
};
export const MapperRoute = {
  path: "/:realm/client-scopes/:id/mappers/:mapperId/:viewMode",
  handle: {
    access: "view-clients",
  },
};

export const toMapper = (params: MapperParams): Partial<Path> => ({
  pathname: generateEncodedPath(MapperRoute.path, params),
});
