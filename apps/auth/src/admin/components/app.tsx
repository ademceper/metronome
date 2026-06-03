/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/App.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { PageNav } from "./page-nav";
import { PropsWithChildren, Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import {
  ErrorBoundaryFallback,
  ErrorBoundaryProvider,
  KeycloakSpinner,
} from "../../shared/keycloak-ui-shared";
import { AdminClientContext, initAdminClient } from "../admin-client";
import { ErrorRenderer } from "../components/error/error-renderer";
import { RecentRealmsProvider } from "../context/recent-realms";
import { AccessContextProvider } from "../context/access/access";
import { RealmContextProvider } from "../context/realm-context/realm-context";
import { ServerInfoProvider } from "../context/server-info/server-info-provider";
import { WhoAmIContextProvider } from "../context/whoami/who-am-i";
import type { Environment } from "../environment";
import { SubGroups } from "../components/groups/sub-groups-context";
import { AuthWall } from "./auth-wall";
import { Banners } from "./banners";

export const AppContexts = ({ children }: PropsWithChildren) => (
  <ErrorBoundaryProvider>
    <ErrorBoundaryFallback fallback={ErrorRenderer}>
      <ServerInfoProvider>
        <RealmContextProvider>
          <WhoAmIContextProvider>
            <RecentRealmsProvider>
              <AccessContextProvider>
                <SubGroups>{children}</SubGroups>
              </AccessContextProvider>
            </RecentRealmsProvider>
          </WhoAmIContextProvider>
        </RealmContextProvider>
      </ServerInfoProvider>
    </ErrorBoundaryFallback>
  </ErrorBoundaryProvider>
);

export const App = () => {
  const { keycloak, environment } = useEnvironment<Environment>();
  const [adminClient, setAdminClient] = useState<KeycloakAdminClient>();

  useEffect(() => {
    const fragment = "#/";
    if (window.location.href.endsWith(fragment)) {
      const newPath = window.location.pathname.replace(fragment, "");
      window.history.replaceState(null, "", newPath);
    }
    const init = async () => {
      const client = await initAdminClient(keycloak, environment);
      setAdminClient(client);
    };
    init().catch(console.error);
  }, [environment, keycloak]);

  if (!adminClient) return <KeycloakSpinner />;
  return (
    <AdminClientContext.Provider value={{ keycloak, adminClient }}>
      <AppContexts>
        <PageNav>
          <Banners />
          <ErrorBoundaryFallback fallback={ErrorRenderer}>
            <Suspense fallback={<KeycloakSpinner />}>
              <AuthWall>
                <Outlet />
              </AuthWall>
            </Suspense>
          </ErrorBoundaryFallback>
        </PageNav>
      </AppContexts>
    </AdminClientContext.Provider>
  );
};
