/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/utils/useUpdateEffect.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { DependencyList, EffectCallback, useEffect, useRef } from "react";

/**
 * A `useEffect` hook that only triggers on updates, not on initial render.
 */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      return effect();
    }

    didMount.current = true;
  }, deps);
}
