/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/resource-types/ClientSelectComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { ClientSelect } from "../../components/client/ClientSelect";
import { ComponentProps } from "../../components/dynamic/components";

export const ClientSelectComponent = (props: ComponentProps) => (
  <ClientSelect {...props} clientKey="id" />
);
