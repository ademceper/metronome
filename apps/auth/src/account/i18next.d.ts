/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/i18next.d.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

// https://www.i18next.com/overview/typescript
import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    // TODO: This flag should be removed and code that errors out should be made functional.
    // This will have to be done incrementally as the amount of errors the defaults produce is just too much.
    allowObjectInHTMLChildren: true;
  }
}
