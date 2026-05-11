/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/PageNav.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { cn } from "@metronome/ui/lib/utils";
import {
  PropsWithChildren,
  MouseEvent as ReactMouseEvent,
  Suspense,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  matchPath,
  useHref,
  useLinkClickHandler,
  useLocation,
} from "react-router-dom";

import fetchContentJson from "../content/fetchContent";
import type { TFuncKey } from "../i18n-type";
import type { AccountEnvironment, Feature } from "..";
import { usePromise } from "../utils/usePromise";


const Nav = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-1", className)} {...props}>{children}</div>
);
const NavExpandable = ({ title, isExpanded, children, ...props }: any) => (
  <li {...props}>
    <details open={isExpanded}>
      <summary className="cursor-pointer rounded-md px-2 py-1 text-sm">{title}</summary>
      <ul className="ml-3 flex flex-col gap-1">{children}</ul>
    </details>
  </li>
);
const NavItem = ({ to, isActive, children, ...props }: any) => (
  <li {...props}>
    <span className={cn("block rounded-md px-2 py-1 text-sm", isActive && "bg-muted font-medium")}>{children}</span>
  </li>
);
const NavList = ({ children, ...props }: any) => (
  <ul className="flex flex-col gap-1" {...props}>{children}</ul>
);
const PageSidebar = ({ children, className, ...props }: any) => (
  <div className={cn("border-r", className)} {...props}>{children}</div>
);
const PageSidebarBody = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;

type RootMenuItem = {
  id?: string;
  label: TFuncKey;
  path: string;
  isVisible?: keyof Feature;
  modulePath?: string;
};

type MenuItemWithChildren = {
  label: TFuncKey;
  children: MenuItem[];
  isVisible?: keyof Feature;
};

export type MenuItem = RootMenuItem | MenuItemWithChildren;

export const PageNav = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>();
  const context = useEnvironment<AccountEnvironment>();

  usePromise((signal) => fetchContentJson({ signal, context }), setMenuItems);
  return (
    <PageSidebar>
      <PageSidebarBody>
        <Nav>
          <NavList>
            <Suspense fallback={<Spinner />}>
              {menuItems
                ?.filter((menuItem) =>
                  menuItem.isVisible
                    ? context.environment.features[menuItem.isVisible]
                    : true,
                )
                .map((menuItem) => (
                  <NavMenuItem
                    key={menuItem.label as string}
                    menuItem={menuItem}
                  />
                ))}
            </Suspense>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
};

type NavMenuItemProps = {
  menuItem: MenuItem;
};

function NavMenuItem({ menuItem }: NavMenuItemProps) {
  const { t } = useTranslation();
  const { environment } = useEnvironment<AccountEnvironment>();
  const { pathname } = useLocation();
  const isActive = useMemo(
    () => matchMenuItem(pathname, menuItem, environment.baseUrl),
    [pathname, menuItem, environment.baseUrl],
  );

  if ("path" in menuItem) {
    return (
      <NavLink path={menuItem.path} isActive={isActive}>
        {t(menuItem.label)}
      </NavLink>
    );
  }

  return (
    <NavExpandable
      data-testid={menuItem.label}
      title={t(menuItem.label)}
      isActive={isActive}
      isExpanded={isActive}
    >
      {menuItem.children
        .filter((menuItem) =>
          menuItem.isVisible ? environment.features[menuItem.isVisible] : true,
        )
        .map((child) => (
          <NavMenuItem key={child.label as string} menuItem={child} />
        ))}
    </NavExpandable>
  );
}

function getFullUrl(path: string, baseUrl: string) {
  return `${new URL(baseUrl).pathname}${path}`;
}

function matchMenuItem(
  currentPath: string,
  menuItem: MenuItem,
  baseUrl: string,
): boolean {
  if ("path" in menuItem) {
    return !!matchPath(getFullUrl(menuItem.path, baseUrl), currentPath);
  }

  return menuItem.children.some((child) =>
    matchMenuItem(currentPath, child, baseUrl),
  );
}

type NavLinkProps = {
  path: string;
  isActive: boolean;
};

export const NavLink = ({
  path,
  isActive,
  children,
}: PropsWithChildren<NavLinkProps>) => {
  const { environment } = useEnvironment<AccountEnvironment>();
  const menuItemPath = getFullUrl(path, environment.baseUrl) + location.search;
  const href = useHref(menuItemPath);
  const handleClick = useLinkClickHandler(menuItemPath);

  return (
    <NavItem
      data-testid={path}
      to={href}
      isActive={isActive}
      onClick={(event) =>
        // PatternFly does not have the correct type for this event, so we need to cast it.
        handleClick(event as unknown as ReactMouseEvent<HTMLAnchorElement>)
      }
    >
      {children}
    </NavItem>
  );
};
