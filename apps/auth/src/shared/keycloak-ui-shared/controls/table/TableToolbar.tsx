/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/table/TableToolbar.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Input } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import {
  MagnifyingGlass as SearchIcon,
  XCircle as XCircleIcon,
} from "@phosphor-icons/react";
import { KeyboardEvent, PropsWithChildren, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

type TableToolbarProps = {
  toolbarItem?: ReactNode;
  subToolbar?: ReactNode;
  toolbarItemFooter?: ReactNode;
  searchTypeComponent?: ReactNode;
  inputGroupName?: string;
  inputGroupPlaceholder?: string;
  inputGroupOnEnter?: (value: string) => void;
};

export const TableToolbar = ({
  toolbarItem,
  subToolbar,
  toolbarItemFooter,
  children,
  searchTypeComponent,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnEnter,
}: PropsWithChildren<TableToolbarProps>) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>("");

  const onSearch = (value: string) => {
    const trimmed = value.trim();
    setSearchValue(trimmed);
    inputGroupOnEnter?.(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchValue);
    }
  };

  return (
    <div className="space-y-4">
      <div
        data-testid="table-toolbar"
        className="flex flex-wrap items-center gap-3"
      >
        {inputGroupName && (
          <div className="flex items-center gap-2" data-testid={inputGroupName}>
            {searchTypeComponent}
            {inputGroupPlaceholder && (
              <div className="relative">
                <Input
                  aria-label={t("search")}
                  className={cn(
                    "peer min-w-60 ps-9",
                    Boolean(searchValue) && "pe-9",
                  )}
                  data-testid="table-search-input"
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={inputGroupPlaceholder}
                  type="text"
                  value={searchValue}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
                  <SearchIcon aria-hidden="true" size={16} />
                </div>
                {Boolean(searchValue) && (
                  <button
                    aria-label="Clear search"
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none hover:text-foreground"
                    onClick={() => onSearch("")}
                    type="button"
                  >
                    <XCircleIcon aria-hidden="true" size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">{toolbarItem}</div>
      </div>
      {subToolbar && <div className="flex items-center gap-2">{subToolbar}</div>}
      {children}
      {toolbarItemFooter && (
        <div className="flex items-center justify-end">{toolbarItemFooter}</div>
      )}
    </div>
  );
};
