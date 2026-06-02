/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/utils/useParams.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useParams as useParamsRR } from "react-router-dom";

export const useParams = <T extends Record<string, string>>() =>
  useParamsRR<T>() as T;
