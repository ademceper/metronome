/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/IdentityProviderMultiSelectComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { ComponentProps } from "./components";
import { IdentityProviderSelect } from "../identity-provider/identity-provider-select";

export const IdentityProviderMultiSelectComponent = (props: ComponentProps) => (
  <IdentityProviderSelect
    {...props}
    convertToName={props.convertToName}
    name={props.name!}
  />
);
