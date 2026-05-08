/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/BackgroundContext.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { createNamedContext } from "../../../shared/keycloak-ui-shared";
import { PropsWithChildren, useContext, useState } from "react";

type BackgroundContextProps = {
  background: string;
  setBackground: (background: string) => void;
};

export const BackgroundPreviewContext = createNamedContext<
  BackgroundContextProps | undefined
>("BackgroundContext", undefined);

export const usePreviewBackground = () => useContext(BackgroundPreviewContext);

export const BackgroundContext = ({ children }: PropsWithChildren) => {
  const [background, setBackground] = useState("");

  return (
    <BackgroundPreviewContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundPreviewContext.Provider>
  );
};
