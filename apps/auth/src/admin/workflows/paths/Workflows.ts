// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type WorkflowsParams = { realm: string };
export const WorkflowsRoute = {
  path: "/:realm/workflows",
  handle: {
    access: "manage-realm",
  },
};

export const toWorkflows = (params: WorkflowsParams): Partial<Path> => ({
  pathname: generateEncodedPath(WorkflowsRoute.path, params),
});
