// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generateEncodedPath";

// ─── from client-scopes/paths/ClientScope.ts ─────
export type ClientScopeTab = "settings" | "mappers" | "scope" | "events";

export type ClientScopeParams = {
  realm: string;
  id: string;
  tab: ClientScopeTab;
};
export const ClientScopeRoute = {
  path: "/:realm/client-scopes/:id/:tab",
  handle: {
    access: "view-clients",
  },
};

export const toClientScope = (params: ClientScopeParams): Partial<Path> => {
  const path = ClientScopeRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};

// ─── from client-scopes/paths/ClientScopes.ts ─────
export type ClientScopesParams = { realm: string };
export const ClientScopesRoute = {
  path: "/:realm/client-scopes",
  handle: {
    access: "view-clients",
  },
};

export const toClientScopes = (params: ClientScopesParams): Partial<Path> => ({
  pathname: generateEncodedPath(ClientScopesRoute.path, params),
});

// ─── from client-scopes/paths/Mapper.ts ─────
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

// ─── from client-scopes/paths/NewClientScope.ts ─────
export type NewClientScopeParams = { realm: string };
export const NewClientScopeRoute = {
  path: "/:realm/client-scopes/new",
  handle: {
    access: "manage-clients",
  },
};

export const toNewClientScope = (
  params: NewClientScopeParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewClientScopeRoute.path, params),
});
