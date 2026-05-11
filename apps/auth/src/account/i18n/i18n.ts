/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/i18n/i18n.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { LanguageDetectorModule, createInstance } from "i18next";
import FetchBackend from "i18next-fetch-backend";
import { initReactI18next } from "react-i18next";

import { environment } from "../environment";
import { joinPath } from "../lib/joinPath";

const DEFAULT_LOCALE = "en";

type KeyValue = { key: string; value: string };

export const keycloakLanguageDetector: LanguageDetectorModule = {
  type: "languageDetector",

  detect() {
    return environment.locale;
  },
};

// Listen to language changes and update the environment locale
window.addEventListener("languageChanged", (event: Event) => {
  const customEvent = event as CustomEvent<{ language: string }>;
  void (async () => {
    await i18n.changeLanguage(customEvent.detail.language, (error) => {
      if (error) {
        console.warn(
          "Error(s) loading locale",
          customEvent.detail.language,
          error,
        );
      }
    });
  })();
});

export const i18n = createInstance({
  fallbackLng: DEFAULT_LOCALE,
  nsSeparator: false,
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: joinPath(
      environment.serverBaseUrl,
      `resources/${environment.realm}/account/{{lng}}`,
    ),
    parse(data: string) {
      const messages: KeyValue[] = JSON.parse(data);

      return Object.fromEntries(messages.map(({ key, value }) => [key, value]));
    },
  },
});

i18n.use(FetchBackend);
i18n.use(keycloakLanguageDetector);
i18n.use(initReactI18next);
