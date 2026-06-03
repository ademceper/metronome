// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generate-encoded-path";
import { ClientRegistrationTab } from "./clients";
import type { PermissionType } from "./clients";

// ─── from clients/paths/AddClient.ts ─────
export type AddClientParams = { realm: string };
export const AddClientRoute = {
  path: "/:realm/clients/add-client",
  handle: {
    access: "manage-clients",
  },
};

export const toAddClient = (params: AddClientParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddClientRoute.path, params),
});

// ─── from clients/paths/AddRegistrationProvider.ts ─────
export type RegistrationProviderParams = {
  realm: string;
  subTab: ClientRegistrationTab;
  id?: string;
  providerId: string;
};
export const AddRegistrationProviderRoute = {
  path: "/:realm/clients/client-registration/:subTab/:providerId",
  handle: {
    access: "manage-clients",
  },
};

export const EditRegistrationProviderRoute = {
  ...AddRegistrationProviderRoute,
  path: "/:realm/clients/client-registration/:subTab/:providerId/:id",
};

export const toRegistrationProvider = (
  params: RegistrationProviderParams,
): Partial<Path> => {
  const path = params.id
    ? EditRegistrationProviderRoute.path
    : AddRegistrationProviderRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};

// ─── from clients/paths/AuthenticationTab.ts ─────
export type AuthorizationTab =
  | "settings"
  | "resources"
  | "scopes"
  | "policies"
  | "permissions"
  | "evaluate"
  | "export";

export type AuthorizationParams = {
  realm: string;
  clientId: string;
  tab: AuthorizationTab;
};
export const AuthorizationRoute = {
  path: "/:realm/clients/:clientId/authorization/:tab",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("view-authorization", "manage-authorization"),
  },
};

export const toAuthorizationTab = (
  params: AuthorizationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(AuthorizationRoute.path, params),
});

// ─── from clients/paths/Client.ts ─────
export type ClientTab =
  | "settings"
  | "keys"
  | "credentials"
  | "roles"
  | "clientScopes"
  | "advanced"
  | "mappers"
  | "authorization"
  | "serviceAccount"
  | "permissions"
  | "sessions"
  | "events";

export type ClientParams = {
  realm: string;
  clientId: string;
  tab: ClientTab;
};
export const ClientRoute = {
  path: "/:realm/clients/:clientId/:tab",
  handle: {
    access: "query-clients",
  },
};

export const toClient = (params: ClientParams): Partial<Path> => ({
  pathname: generateEncodedPath(ClientRoute.path, params),
});

// ─── from clients/paths/ClientRegistration.ts ─────
export type ClientRegistrationTab = "anonymous" | "authenticated";

export type ClientRegistrationParams = {
  realm: string;
  subTab: ClientRegistrationTab;
};
export const ClientRegistrationRoute = {
  path: "/:realm/clients/client-registration/:subTab",
  handle: {
    access: "view-clients",
  },
};

export const toClientRegistration = (
  params: ClientRegistrationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientRegistrationRoute.path, params),
});

// ─── from clients/paths/ClientRole.ts ─────
export type ClientRoleTab =
  | "details"
  | "attributes"
  | "users-in-role"
  | "associated-roles";

export type ClientRoleParams = {
  realm: string;
  clientId: string;
  id: string;
  tab: ClientRoleTab;
};
export const ClientRoleRoute = {
  path: "/:realm/clients/:clientId/roles/:id/:tab" as const,
  handle: {
    access: "query-clients",
  },
};

export const toClientRole = (params: ClientRoleParams): Partial<Path> => ({
  pathname: generateEncodedPath(ClientRoleRoute.path, params),
});

// ─── from clients/paths/ClientScopeTab.ts ─────
export type ClientScopesTab = "setup" | "evaluate";

export type ClientScopesParams = {
  realm: string;
  clientId: string;
  tab: ClientScopesTab;
};
export const ClientScopesRoute = {
  path: "/:realm/clients/:clientId/client-scopes/:tab",
  handle: {
    access: "view-clients",
  },
};

export const toClientScopesTab = (
  params: ClientScopesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientScopesRoute.path, params),
});

// ─── from clients/paths/Clients.ts ─────
export type ClientsTab =
  | "list"
  | "initial-access-token"
  | "client-registration";

export type ClientsParams = {
  realm: string;
  tab?: ClientsTab;
};
export const ClientsRoute = {
  path: "/:realm/clients",
  handle: {
    access: "query-clients",
  },
};

export const ClientsRouteWithTab = {
  ...ClientsRoute,
  path: "/:realm/clients/:tab",
};

export const toClients = (params: ClientsParams): Partial<Path> => {
  const path = params.tab ? ClientsRouteWithTab.path : ClientsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};

// ─── from clients/paths/CreateInitialAccessToken.ts ─────
export type CreateInitialAccessTokenParams = { realm: string };
export const CreateInitialAccessTokenRoute = {
  path: "/:realm/clients/initial-access-token/create",
  handle: {
    access: "manage-clients",
  },
};

export const toCreateInitialAccessToken = (
  params: CreateInitialAccessTokenParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(CreateInitialAccessTokenRoute.path, params),
});

// ─── from clients/paths/DedicatedScopeDetails.ts ─────
export type DedicatedScopeTab = "mappers" | "scope";

export type DedicatedScopeDetailsParams = {
  realm: string;
  clientId: string;
  tab?: DedicatedScopeTab;
};
export const DedicatedScopeDetailsRoute = {
  path: "/:realm/clients/:clientId/client-scopes/dedicated",
  handle: {
    access: "view-clients",
  },
};

export const DedicatedScopeDetailsWithTabRoute = {
  ...DedicatedScopeDetailsRoute,
  path: "/:realm/clients/:clientId/client-scopes/dedicated/:tab",
};

export const toDedicatedScope = (
  params: DedicatedScopeDetailsParams,
): Partial<Path> => {
  const path = params.tab
    ? DedicatedScopeDetailsWithTabRoute.path
    : DedicatedScopeDetailsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};

// ─── from clients/paths/ImportClient.ts ─────
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

// ─── from clients/paths/Mapper.ts ─────
export type MapperParams = {
  realm: string;
  id: string;
  mapperId: string;
  viewMode: "edit" | "new";
};
export const MapperRoute = {
  path: "/:realm/clients/:id/client-scopes/dedicated/mappers/:mapperId/:viewMode",
  handle: {
    access: "view-clients",
  },
};

export const toMapper = (params: MapperParams): Partial<Path> => ({
  pathname: generateEncodedPath(MapperRoute.path, params),
});

// ─── from clients/paths/NewPermission.ts ─────
export type PermissionType = "resource" | "scope";

export type NewPermissionParams = {
  realm: string;
  id: string;
  permissionType: PermissionType;
  selectedId?: string;
};
export const NewPermissionRoute = {
  path: "/:realm/clients/:id/authorization/permission/new/:permissionType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const NewPermissionWithSelectedIdRoute = {
  ...NewPermissionRoute,
  path: "/:realm/clients/:id/authorization/permission/new/:permissionType/:selectedId",
};

export const toNewPermission = (params: NewPermissionParams): Partial<Path> => {
  const path = params.selectedId
    ? NewPermissionWithSelectedIdRoute.path
    : NewPermissionRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};

// ─── from clients/paths/NewPolicy.ts ─────
export type NewPolicyParams = { realm: string; id: string; policyType: string };
export const NewPolicyRoute = {
  path: "/:realm/clients/:id/authorization/policy/new/:policyType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toCreatePolicy = (params: NewPolicyParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewPolicyRoute.path, params),
});

// ─── from clients/paths/NewResource.ts ─────
export type NewResourceParams = { realm: string; id: string };
export const NewResourceRoute = {
  path: "/:realm/clients/:id/authorization/resource/new",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toCreateResource = (params: NewResourceParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewResourceRoute.path, params),
});

// ─── from clients/paths/NewRole.ts ─────
export type NewRoleParams = { realm: string; clientId: string };
export const NewRoleRoute = {
  path: "/:realm/clients/:clientId/roles/new",
  handle: {
    access: "query-clients",
  },
};

export const toCreateRole = (params: NewRoleParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewRoleRoute.path, params),
});

// ─── from clients/paths/NewScope.ts ─────
export type NewScopeParams = { realm: string; id: string };
export const NewScopeRoute = {
  path: "/:realm/clients/:id/authorization/scope/new",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toNewScope = (params: NewScopeParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewScopeRoute.path, params),
});

// ─── from clients/paths/PermissionConfigurationDetails.ts ─────
export type PermissionConfigurationDetailParams = {
  realm: string;
  id: string;
  permissionId: string;
  permissionType: string;
};
export const PermissionConfigurationDetailRoute = {
  path: "/:realm/clients/:id/permissions/permission/:permissionId/:permissionType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPermissionConfigurationDetails = (
  params: PermissionConfigurationDetailParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(
    PermissionConfigurationDetailRoute.path,
    params,
  ),
});

// ─── from clients/paths/PermissionDetails.ts ─────
export type PermissionDetailsParams = {
  realm: string;
  id: string;
  permissionType: string | PermissionType;
  permissionId: string;
};
export const PermissionDetailsRoute = {
  path: "/:realm/clients/:id/authorization/permission/:permissionType/:permissionId",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPermissionDetails = (
  params: PermissionDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionDetailsRoute.path, params),
});

// ─── from clients/paths/PolicyDetails.ts ─────
export type PolicyDetailsParams = {
  realm: string;
  id: string;
  policyId: string;
  policyType: string;
};
export const PolicyDetailsRoute = {
  path: "/:realm/clients/:id/authorization/policy/:policyId/:policyType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPolicyDetails = (
  params: PolicyDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PolicyDetailsRoute.path, params),
});

// ─── from clients/paths/Resource.ts ─────
export type ResourceDetailsParams = {
  realm: string;
  id: string;
  resourceId?: string;
};
export const ResourceDetailsRoute = {
  path: "/:realm/clients/:id/authorization/resource",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const ResourceDetailsWithResourceIdRoute = {
  ...ResourceDetailsRoute,
  path: "/:realm/clients/:id/authorization/resource/:resourceId",
};

export const toResourceDetails = (
  params: ResourceDetailsParams,
): Partial<Path> => {
  const path = params.resourceId
    ? ResourceDetailsWithResourceIdRoute.path
    : ResourceDetailsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};

// ─── from clients/paths/Scope.ts ─────
export type ScopeDetailsParams = {
  realm: string;
  id: string;
  scopeId?: string;
};
export const ScopeDetailsRoute = {
  path: "/:realm/clients/:id/authorization/scope",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "view-authorization"),
  },
};

export const ScopeDetailsWithScopeIdRoute = {
  ...ScopeDetailsRoute,
  path: "/:realm/clients/:id/authorization/scope/:scopeId",
};

export const toScopeDetails = (params: ScopeDetailsParams): Partial<Path> => {
  const path = params.scopeId
    ? ScopeDetailsWithScopeIdRoute.path
    : ScopeDetailsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
