// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generateEncodedPath";

// ─── from workflows/paths/WorkflowDetail.ts ─────
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

// ─── from workflows/paths/Workflows.ts ─────
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
