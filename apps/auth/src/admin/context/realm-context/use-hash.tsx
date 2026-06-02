/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/context/realm-context/useHash.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useEffect, useState } from "react";

function getHash(url: URL) {
  return decodeURIComponent(url.hash.substring(1));
}

export const useHash = () => {
  const [hash, setHash] = useState(getHash(new URL(window.location.href)));

  useEffect(() => {
    const orgPushState = window.history.pushState;
    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (func, target, args) => {
        const url = new URL(args[2], window.location.origin);
        setHash(getHash(url));
        return Reflect.apply(func, target, args);
      },
    });
    return () => {
      window.history.pushState = orgPushState;
    };
  }, []);

  return hash;
};
