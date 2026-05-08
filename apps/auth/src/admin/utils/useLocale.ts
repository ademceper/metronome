/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/utils/useLocale.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useMemo } from "react";
import { useRealm } from "../context/realm-context/RealmContext";
import { DEFAULT_LOCALE } from "../i18n/constants";

export default function useLocale() {
  const { realmRepresentation: realm } = useRealm();

  const defaultSupportedLocales = useMemo(() => {
    return realm?.supportedLocales?.length
      ? realm.supportedLocales
      : [DEFAULT_LOCALE];
  }, [realm]);

  const defaultLocales = useMemo(() => {
    return realm?.defaultLocale?.length ? [realm.defaultLocale] : [];
  }, [realm]);

  const combinedLocales = useMemo(() => {
    return Array.from(new Set([...defaultLocales, ...defaultSupportedLocales]));
  }, [defaultLocales, defaultSupportedLocales]);

  return combinedLocales;
}
