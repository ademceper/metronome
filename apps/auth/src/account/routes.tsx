/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/routes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  createRootRoute,
  createRoute,
  type AnyRoute,
} from "@tanstack/react-router";
import { lazy } from "react";
import { Organizations } from "./organizations/Organizations";

const DeviceActivity = lazy(() => import("./account-security/DeviceActivity"));
const LinkedAccounts = lazy(() => import("./account-security/LinkedAccounts"));
const SigningIn = lazy(() => import("./account-security/SigningIn"));
const Applications = lazy(() => import("./applications/Applications"));
const Groups = lazy(() => import("./groups/Groups"));
const PersonalInfo = lazy(() => import("./personal-info/PersonalInfo"));
const Resources = lazy(() => import("./resources/Resources"));
const ContentComponent = lazy(() => import("./content/ContentComponent"));
const Oid4Vci = lazy(() => import("./oid4vci/Oid4Vci"));

export type ContentComponentParams = {
  componentId: string;
};

export type AccountRouteSpec = {
  path: string;
  component: React.ComponentType<any>;
};

export const accountRouteSpecs: AccountRouteSpec[] = [
  { path: "/", component: PersonalInfo },
  { path: "/account-security/device-activity", component: DeviceActivity },
  { path: "/account-security/linked-accounts", component: LinkedAccounts },
  { path: "/account-security/signing-in", component: SigningIn },
  { path: "/applications", component: Applications },
  { path: "/groups", component: Groups },
  { path: "/organizations", component: Organizations },
  { path: "/resources", component: Resources },
  { path: "/oid4vci", component: Oid4Vci },
  { path: "/content/$componentId", component: ContentComponent },
];

export const buildAccountRoutes = (rootRoute: AnyRoute): AnyRoute[] =>
  accountRouteSpecs.map(({ path, component }) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component,
    }),
  );
