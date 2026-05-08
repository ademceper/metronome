/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/key-value-form/key-value-convert.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Path, PathValue } from "react-hook-form";

export type KeyValueType = { key: string; value: string };

export function keyValueToArray(attributeArray: KeyValueType[] = []) {
  const validAttributes = attributeArray.filter(({ key }) => key !== "");
  const result: Record<string, string[]> = {};

  for (const { key, value } of validAttributes) {
    if (key in result) {
      result[key].push(value);
    } else {
      result[key] = [value];
    }
  }

  return result;
}

export function arrayToKeyValue<T>(attributes: Record<string, string[]> = {}) {
  const result = Object.entries(attributes).flatMap(([key, value]) =>
    value.map<KeyValueType>((value) => ({ key, value })),
  );

  return result as PathValue<T, Path<T>>;
}
