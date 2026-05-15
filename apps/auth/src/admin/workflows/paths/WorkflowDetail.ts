// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type WorkflowDetailParams = {
  realm: string;
  id: string;
  mode: "update" | "copy" | "create";
};
export const WorkflowDetailRoute = {
  path: "/:realm/workflows/:mode/:id",
  handle: {
    access: "manage-realm",
  },
};

export const toWorkflowDetail = (
  params: WorkflowDetailParams,
): Partial<Path> => {
  return {
    pathname: generateEncodedPath(WorkflowDetailRoute.path, params),
  };
};
