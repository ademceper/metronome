/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/utils/formatDate.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

export const FORMAT_DATE_ONLY: Intl.DateTimeFormatOptions = {
  dateStyle: "long",
};

export const FORMAT_TIME_ONLY: Intl.DateTimeFormatOptions = {
  timeStyle: "short",
};

export const FORMAT_DATE_AND_TIME: Intl.DateTimeFormatOptions = {
  ...FORMAT_DATE_ONLY,
  ...FORMAT_TIME_ONLY,
};

export function formatDate(
  date: Date,
  locale: string = "en",
  options = FORMAT_DATE_AND_TIME,
) {
  return date.toLocaleString(locale, options);
}
