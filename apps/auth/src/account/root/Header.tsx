/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Header.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { label, useEnvironment } from "../../shared/keycloak-ui-shared";
import {
  Avatar,
  AvatarFallback,
} from "@metronome/ui/components/avatar";
import { Button } from "@metronome/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import {
  ArrowSquareOutIcon,
  CaretDownIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { AccountEnvironment } from "..";

const ReferrerLink = () => {
  const { environment } = useEnvironment<AccountEnvironment>();
  const { t } = useTranslation();
  if (!environment.referrerUrl) return null;
  return (
    <a
      href={environment.referrerUrl.replace("_hash_", "#")}
      className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      data-testid="referrer-link"
    >
      {t("backTo", {
        app: label(t, environment.referrerName, environment.referrerUrl),
      })}
      <ArrowSquareOutIcon className="size-4" />
    </a>
  );
};

const UserMenu = () => {
  const { keycloak } = useEnvironment<AccountEnvironment>();
  const tokenParsed: any = keycloak?.tokenParsed ?? {};
  const displayName: string =
    tokenParsed.name ||
    tokenParsed.preferred_username ||
    tokenParsed.email ||
    "Account";
  const initials = (displayName || "?").slice(0, 2).toUpperCase();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm sm:inline">{displayName}</span>
          <CaretDownIcon className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="text-sm">{displayName}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => keycloak?.logout()}>
          <SignOutIcon />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header = ({ className }: { className?: string }) => {
  const { environment } = useEnvironment<AccountEnvironment>();
  const realm = environment?.realm;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-background/95 backdrop-blur",
        className,
      )}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-10 border-b px-4">
        <a
          href={environment?.baseUrl}
          className="text-2xl leading-none tracking-widest"
          style={{ fontFamily: '"Climate Crisis", sans-serif' }}
          data-testid="page-header"
        >
          {realm}
        </a>
        <div className="flex items-center gap-6">
          <ReferrerLink />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
