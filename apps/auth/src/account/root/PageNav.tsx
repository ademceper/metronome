/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/PageNav.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  matchPath,
  NavLink as RRNavLink,
  useLocation,
} from "react-router-dom";

import fetchContentJson from "../content/fetchContent";
import type { TFuncKey } from "../i18n-type";
import type { AccountEnvironment, Feature } from "..";
import { usePromise } from "../utils/usePromise";

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

const getFullUrl = (path: string, baseUrl: string) =>
  `${new URL(baseUrl).pathname}${path}`;

const matchMenuItem = (
  currentPath: string,
  menuItem: MenuItem,
  baseUrl: string,
): boolean => {
  if ("path" in menuItem) {
    return !!matchPath(getFullUrl(menuItem.path, baseUrl), currentPath);
  }
  return menuItem.children.some((c) => matchMenuItem(currentPath, c, baseUrl));
};

const LeafLink = ({
  menuItem,
  className,
}: {
  menuItem: RootMenuItem;
  className?: string;
}) => {
  const { t } = useTranslation();
  const { environment } = useEnvironment<AccountEnvironment>();
  const fullPath = getFullUrl(menuItem.path, environment.baseUrl);
  return (
    <RRNavLink
      to={fullPath + location.search}
      data-testid={menuItem.path}
      end={menuItem.path === ""}
      className={({ isActive }) =>
        cn(
          "flex h-12 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          isActive && "bg-muted font-medium text-foreground",
          className,
        )
      }
    >
      {t(menuItem.label)}
    </RRNavLink>
  );
};

const Group = ({ menuItem }: { menuItem: MenuItemWithChildren }) => {
  const { t } = useTranslation();
  const { environment } = useEnvironment<AccountEnvironment>();
  const { pathname } = useLocation();
  const isOpenDefault = useMemo(
    () => matchMenuItem(pathname, menuItem, environment.baseUrl),
    [pathname, menuItem, environment.baseUrl],
  );
  const [open, setOpen] = useState(isOpenDefault);

  const visibleChildren = menuItem.children.filter((c) =>
    c.isVisible ? environment.features[c.isVisible] : true,
  );

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center justify-between rounded-md px-3 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
      >
        <span>{t(menuItem.label)}</span>
        <CaretRightIcon
          className={cn(
            "size-3.5 transition-transform",
            open && "rotate-90",
          )}
        />
      </button>
      {open && (
        <ul className="mt-1 ms-3 flex flex-col gap-0.5 border-s ps-3">
          {visibleChildren.map((child) =>
            "path" in child ? (
              <li key={child.label as string}>
                <LeafLink menuItem={child} />
              </li>
            ) : (
              <Group key={child.label as string} menuItem={child} />
            ),
          )}
        </ul>
      )}
    </li>
  );
};

export const PageNav = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>();
  const context = useEnvironment<AccountEnvironment>();
  usePromise((signal) => fetchContentJson({ signal, context }), setMenuItems);

  if (!menuItems) return null;

  const visible = menuItems.filter((m) =>
    m.isVisible ? context.environment.features[m.isVisible] : true,
  );

  return (
    <nav aria-label="account navigation">
      <ul className="flex flex-col gap-0.5">
        {visible.map((item) =>
          "path" in item ? (
            <li key={item.label as string}>
              <LeafLink menuItem={item} />
            </li>
          ) : (
            <Group key={item.label as string} menuItem={item} />
          ),
        )}
      </ul>
    </nav>
  );
};
