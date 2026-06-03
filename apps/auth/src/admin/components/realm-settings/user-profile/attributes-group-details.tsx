/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/AttributesGroupDetails.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import AttributesGroupForm from "./attributes-group-form";
import { UserProfileProvider } from "./user-profile-context";

const AttributesGroupDetails = () => (
  <UserProfileProvider>
    <AttributesGroupForm />
  </UserProfileProvider>
);

export default AttributesGroupDetails;
