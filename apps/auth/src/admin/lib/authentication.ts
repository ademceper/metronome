// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generateEncodedPath";

// ─── from authentication/paths/Authentication.ts ─────
export type AuthenticationTab = "flows" | "required-actions" | "policies";

export type AuthenticationParams = { realm: string; tab?: AuthenticationTab };
export const AuthenticationRoute = {
  path: "/:realm/authentication",
  handle: {
    access: ["view-realm", "view-identity-providers", "view-clients"],
  },
};

export const AuthenticationRouteWithTab = {
  ...AuthenticationRoute,
  path: "/:realm/authentication/:tab",
};

export const toAuthentication = (
  params: AuthenticationParams,
): Partial<Path> => {
  const path = params.tab
    ? AuthenticationRouteWithTab.path
    : AuthenticationRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};

// ─── from authentication/paths/CreateFlow.ts ─────
export type CreateFlowParams = { realm: string };
export const CreateFlowRoute = {
  path: "/:realm/authentication/flows/create",
  handle: {
    access: "manage-authorization",
  },
};

export const toCreateFlow = (params: CreateFlowParams): Partial<Path> => ({
  pathname: generateEncodedPath(CreateFlowRoute.path, params),
});

// ─── from authentication/paths/Flow.ts ─────
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
