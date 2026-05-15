// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type FlowParams = {
  realm: string;
  id: string;
  usedBy: string;
  builtIn?: string;
};
export const FlowRoute = {
  path: "/:realm/authentication/:id/:usedBy",
  handle: {
    access: "view-authorization",
  },
};

export const FlowWithBuiltInRoute = {
  ...FlowRoute,
  path: "/:realm/authentication/:id/:usedBy/:builtIn",
};

export const toFlow = (params: FlowParams): Partial<Path> => {
  const path = params.builtIn ? FlowWithBuiltInRoute.path : FlowRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
