// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generate-encoded-path";

// ─── from realm-settings/paths/AddAttribute.ts ─────
export type AddAttributeParams = {
  realm: string;
};
export const AddAttributeRoute = {
  path: "/:realm/realm-settings/user-profile/attributes/add-attribute",
  handle: {
    access: "manage-realm",
  },
};

export const toAddAttribute = (params: AddAttributeParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddAttributeRoute.path, params),
});

// ─── from realm-settings/paths/AddClientPolicy.ts ─────
export type AddClientPolicyParams = { realm: string };
export const AddClientPolicyRoute = {
  path: "/:realm/realm-settings/client-policies/policies/add-client-policy",
  handle: {
    access: "manage-clients",
  },
};

export const toAddClientPolicy = (
  params: AddClientPolicyParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(AddClientPolicyRoute.path, params),
});

// ─── from realm-settings/paths/AddClientProfile.ts ─────
export type AddClientProfileParams = {
  realm: string;
  tab: string;
};
export const AddClientProfileRoute = {
  path: "/:realm/realm-settings/client-policies/:tab/add-profile",
  handle: {
    access: "manage-realm",
  },
};

export const toAddClientProfile = (
  params: AddClientProfileParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(AddClientProfileRoute.path, params),
});

// ─── from realm-settings/paths/AddCondition.ts ─────
export type NewClientPolicyConditionParams = {
  realm: string;
  policyName: string;
};
export const NewClientPolicyConditionRoute = {
  path: "/:realm/realm-settings/client-policies/:policyName/edit-policy/create-condition",
  handle: {
    access: "manage-clients",
  },
};

export const toNewClientPolicyCondition = (
  params: NewClientPolicyConditionParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewClientPolicyConditionRoute.path, params),
});

// ─── from realm-settings/paths/AddExecutor.ts ─────
export type AddExecutorParams = {
  realm: string;
  profileName: string;
};
export const AddExecutorRoute = {
  path: "/:realm/realm-settings/client-policies/:profileName/add-executor",
  handle: {
    access: "manage-realm",
  },
};

export const toAddExecutor = (params: AddExecutorParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddExecutorRoute.path, params),
});

// ─── from realm-settings/paths/Attribute.ts ─────
export type AttributeParams = {
  realm: string;
  attributeName: string;
};
export const AttributeRoute = {
  path: "/:realm/realm-settings/user-profile/attributes/:attributeName/edit-attribute",
  handle: {
    access: "manage-realm",
  },
};

export const toAttribute = (params: AttributeParams): Partial<Path> => ({
  pathname: generateEncodedPath(AttributeRoute.path, params),
});

// ─── from realm-settings/paths/ClientPolicies.ts ─────
export type ClientPoliciesTab = "profiles" | "policies";

export type ClientPoliciesParams = {
  realm: string;
  tab: ClientPoliciesTab;
};
export const ClientPoliciesRoute = {
  path: "/:realm/realm-settings/client-policies/:tab",
  handle: {
    access: "view-realm",
  },
};

export const toClientPolicies = (
  params: ClientPoliciesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientPoliciesRoute.path, params),
});

// ─── from realm-settings/paths/ClientProfile.ts ─────
export type ClientProfileParams = {
  realm: string;
  profileName: string;
};
export const ClientProfileRoute = {
  path: "/:realm/realm-settings/client-policies/:profileName/edit-profile",
  handle: {
    access: ["view-realm", "view-users"],
  },
};

export const toClientProfile = (
  params: ClientProfileParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientProfileRoute.path, params),
});

// ─── from realm-settings/paths/EditAttributesGroup.ts ─────
export type EditAttributesGroupParams = {
  realm: string;
  name: string;
};
export const EditAttributesGroupRoute = {
  path: "/:realm/realm-settings/user-profile/attributesGroup/edit/:name",
  handle: {
    access: "view-realm",
  },
};

export const toEditAttributesGroup = (
  params: EditAttributesGroupParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditAttributesGroupRoute.path, params),
});

// ─── from realm-settings/paths/EditClientPolicy.ts ─────
export type EditClientPolicyParams = {
  realm: string;
  policyName: string;
};
export const EditClientPolicyRoute = {
  path: "/:realm/realm-settings/client-policies/:policyName/edit-policy",
  handle: {
    access: "manage-realm",
  },
};

export const toEditClientPolicy = (
  params: EditClientPolicyParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditClientPolicyRoute.path, params),
});

// ─── from realm-settings/paths/EditCondition.ts ─────
export type EditClientPolicyConditionParams = {
  realm: string;
  policyName: string;
  conditionName: string;
};
export const EditClientPolicyConditionRoute = {
  path: "/:realm/realm-settings/client-policies/:policyName/edit-policy/:conditionName/edit-condition",
  handle: {
    access: "manage-clients",
  },
};

export const toEditClientPolicyCondition = (
  params: EditClientPolicyConditionParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditClientPolicyConditionRoute.path, params),
});

// ─── from realm-settings/paths/Executor.ts ─────
export type ExecutorParams = {
  realm: string;
  profileName: string;
  executorName: string;
};
export const ExecutorRoute = {
  path: "/:realm/realm-settings/client-policies/:profileName/edit-profile/:executorName",
  handle: {
    access: ["manage-realm"],
  },
};

export const toExecutor = (params: ExecutorParams): Partial<Path> => ({
  pathname: generateEncodedPath(ExecutorRoute.path, params),
});

// ─── from realm-settings/paths/KeyProvider.ts ─────
export type ProviderType =
  | "aes-generated"
  | "ecdsa-generated"
  | "hmac-generated"
  | "java-keystore"
  | "rsa"
  | "rsa-enc"
  | "rsa-enc-generated"
  | "rsa-generated";

export type KeyProviderParams = {
  id: string;
  providerType: ProviderType;
  realm: string;
};
export const KeyProviderFormRoute = {
  path: "/:realm/realm-settings/keys/providers/:id/:providerType/settings",
  handle: {
    access: "view-realm",
  },
};

export const toKeyProvider = (params: KeyProviderParams): Partial<Path> => ({
  pathname: generateEncodedPath(KeyProviderFormRoute.path, params),
});

// ─── from realm-settings/paths/KeysTab.ts ─────
export type KeySubTab = "list" | "providers";

export type KeysParams = {
  realm: string;
  tab: KeySubTab;
};
export const KeysRoute = {
  path: "/:realm/realm-settings/keys/:tab",
  handle: {
    access: "view-realm",
  },
};

export const toKeysTab = (params: KeysParams): Partial<Path> => ({
  pathname: generateEncodedPath(KeysRoute.path, params),
});

// ─── from realm-settings/paths/NewAttributesGroup.ts ─────
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

// ─── from realm-settings/paths/RealmSettings.ts ─────
export type RealmSettingsTab =
  | "general"
  | "login"
  | "email"
  | "themes"
  | "keys"
  | "events"
  | "localization"
  | "security-defenses"
  | "sessions"
  | "tokens"
  | "client-policies"
  | "user-profile"
  | "user-registration";

export type RealmSettingsParams = {
  realm: string;
  tab?: RealmSettingsTab;
};
export const RealmSettingsRoute = {
  path: "/:realm/realm-settings",
  handle: {
    access: "view-realm",
  },
};

export const RealmSettingsRouteWithTab = {
  ...RealmSettingsRoute,
  path: "/:realm/realm-settings/:tab",
};

export const toRealmSettings = (params: RealmSettingsParams): Partial<Path> => {
  const path = params.tab
    ? RealmSettingsRouteWithTab.path
    : RealmSettingsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};

// ─── from realm-settings/paths/ThemesTab.ts ─────
export type ThemesTabType = "settings" | "quickTheme";

export type ThemesParams = {
  realm: string;
  tab: ThemesTabType;
};
export const ThemeTabRoute = {
  path: "/:realm/realm-settings/themes/:tab",
  handle: {
    access: "view-realm",
  },
};

export const toThemesTab = (params: ThemesParams): Partial<Path> => ({
  pathname: generateEncodedPath(ThemeTabRoute.path, params),
});

// ─── from realm-settings/paths/UserProfile.ts ─────
export type UserProfileTab =
  | "attributes"
  | "attributes-group"
  | "unmanaged-attributes"
  | "json-editor";

export type UserProfileParams = {
  realm: string;
  tab: UserProfileTab;
};
export const UserProfileRoute = {
  path: "/:realm/realm-settings/user-profile/:tab",
  handle: {
    access: "view-realm",
  },
};

export const toUserProfile = (params: UserProfileParams): Partial<Path> => ({
  pathname: generateEncodedPath(UserProfileRoute.path, params),
});
