// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ProviderType =
  | "aes-generated"
  | "ecdsa-generated"
  | "hmac-generated"
  | "java-keystore"
  | "rsa"
  | "rsa-enc"
  | "rsa-enc-generated"
  | "rsa-generated";

export type KeyProviderParams = {
  id: string;
  providerType: ProviderType;
  realm: string;
};
export const KeyProviderFormRoute = {
  path: "/:realm/realm-settings/keys/providers/:id/:providerType/settings",
  handle: {
    access: "view-realm",
  },
};

export const toKeyProvider = (params: KeyProviderParams): Partial<Path> => ({
  pathname: generateEncodedPath(KeyProviderFormRoute.path, params),
});
