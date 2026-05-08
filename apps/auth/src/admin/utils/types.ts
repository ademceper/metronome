/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/utils/types.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

export type ReplaceStringOptions = {
  skipFirst?: boolean;
};

export type ReplaceString<
  Input extends string,
  Search extends string,
  Replacement extends string,
  Options extends ReplaceStringOptions = object,
> = Input extends `${infer Head}${Search}${infer Tail}`
  ? Options["skipFirst"] extends true
    ? `${Head}${Search}${ReplaceString<Tail, Search, Replacement>}`
    : `${Head}${Replacement}${ReplaceString<Tail, Search, Replacement>}`
  : Input;
