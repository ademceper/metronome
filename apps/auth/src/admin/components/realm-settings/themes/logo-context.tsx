/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/LogoContext.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { createNamedContext } from "../../../../shared/keycloak-ui-shared";
import { PropsWithChildren, useContext, useState } from "react";

type LogoContextProps = {
  logo: string;
  setLogo: (logo: string) => void;
};

export const LogoPreviewContext = createNamedContext<
  LogoContextProps | undefined
>("LogoContext", undefined);

export const usePreviewLogo = () => useContext(LogoPreviewContext);

export const LogoContext = ({ children }: PropsWithChildren) => {
  const [logo, setLogo] = useState("");

  return (
    <LogoPreviewContext.Provider value={{ logo, setLogo }}>
      {children}
    </LogoPreviewContext.Provider>
  );
};
