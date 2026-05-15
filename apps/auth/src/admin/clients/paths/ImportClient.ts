// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ImportClientParams = { realm: string };
export const ImportClientRoute = {
  path: "/:realm/clients/import-client",
  handle: {
    access: "manage-clients",
  },
};

export const toImportClient = (params: ImportClientParams): Partial<Path> => ({
  pathname: generateEncodedPath(ImportClientRoute.path, params),
});
