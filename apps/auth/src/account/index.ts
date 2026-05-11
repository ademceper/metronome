import type { BaseEnvironment } from "../shared/keycloak-ui-shared";

export type Feature = {
  deleteAccountAllowed: boolean;
  updateEmailFeatureEnabled: boolean;
  updateEmailActionEnabled: boolean;
  isRegistrationEmailAsUsername: boolean;
  isEditUserNameAllowed: boolean;
  isLinkedAccountsEnabled: boolean;
  isViewGroupsEnabled: boolean;
  isViewOrganizationsEnabled: boolean;
  isMyResourcesEnabled: boolean;
  isOid4VciEnabled: boolean;
};

export type AccountEnvironment = BaseEnvironment & {
  baseUrl: string;
  locale: string;
  referrerUrl?: string;
  referrerName?: string;
  features: Feature;
};
