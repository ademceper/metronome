/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/content/fetchContent.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { CallOptions } from "../api/methods";
import type { MenuItem } from "../root/PageNav";

export default async function fetchContentJson(
  opts: CallOptions,
): Promise<MenuItem[]> {
  const { content } = await import("../assets/content");
  return content;
}
