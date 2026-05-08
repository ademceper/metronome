/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/context/HelpContext.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { PropsWithChildren } from "react";
import { createNamedContext } from "../utils/createNamedContext";
import { useRequiredContext } from "../utils/useRequiredContext";
import { useStoredState } from "../utils/useStoredState";

type HelpContextProps = {
  enabled: boolean;
  toggleHelp: () => void;
};

export const HelpContext = createNamedContext<HelpContextProps | undefined>(
  "HelpContext",
  undefined,
);

export const useHelp = () => useRequiredContext(HelpContext);

export const Help = ({ children }: PropsWithChildren) => {
  const [enabled, setHelp] = useStoredState(localStorage, "helpEnabled", true);

  function toggleHelp() {
    setHelp(!enabled);
  }

  return (
    <HelpContext.Provider value={{ enabled, toggleHelp }}>
      {children}
    </HelpContext.Provider>
  );
};
