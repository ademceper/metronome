/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/utils/translationFormatter.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { label } from "../../shared/keycloak-ui-shared";
import { TFunction } from "i18next";

type IFormatterValueType = any;
type IFormatter = (value?: IFormatterValueType) => any;

export const translationFormatter =
  (t: TFunction): IFormatter =>
  (data?: IFormatterValueType) => {
    return data ? label(t, data as string) || "—" : "—";
  };
