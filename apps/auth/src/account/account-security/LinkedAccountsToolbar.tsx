/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/LinkedAccountsToolbar.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";

const Pagination = ({ itemCount, perPage, page, onSetPage, onPerPageSelect, perPageOptions, variant, isCompact, toggleTemplate, titles, widgetId, ...props }: any) => (
  <div className="flex items-center justify-end gap-2 py-2 text-sm" {...props}>
    <UIButton variant="outline" size="sm" onClick={(e: any) => onSetPage?.(e, Math.max(1, (page ?? 1) - 1))}>Previous</UIButton>
    <span className="text-muted-foreground">
      Page {page ?? 1}
      {typeof itemCount === "number" && perPage ? ` of ${Math.max(1, Math.ceil(itemCount / perPage))}` : ""}
    </span>
    <UIButton variant="outline" size="sm" onClick={(e: any) => onSetPage?.(e, (page ?? 1) + 1)}>Next</UIButton>
  </div>
);
const SearchInput = ({ value, onChange, onClear, onSearch, placeholder, ...props }: any) => (
  <UIInput type="search" value={value ?? ""} placeholder={placeholder}
    onChange={(e: any) => onChange?.(e.target.value, e)} {...props} />
);
const Toolbar = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const ToolbarContent = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>{children}</div>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);
type PaginationToggleTemplateProps = {
  firstIndex?: number;
  lastIndex?: number;
  itemCount?: number;
  itemsTitle?: string;
};

type LinkedAccountsToolbarProps = {
  onFilter: (nameFilter: string) => void;
  count: number;
  first: number;
  max: number;
  onNextClick: (page: number) => void;
  onPreviousClick: (page: number) => void;
  onPerPageSelect: (max: number, first: number) => void;
  hasNext: boolean;
};

export const LinkedAccountsToolbar = ({
  count,
  first,
  max,
  onNextClick,
  onPreviousClick,
  onPerPageSelect,
  onFilter,
  hasNext,
}: LinkedAccountsToolbarProps) => {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState("");

  const page = Math.round(first / max) + 1;
  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <SearchInput
            placeholder={t("filterByName")}
            aria-label={t("filterByName")}
            value={nameFilter}
            onChange={(_, value) => {
              setNameFilter(value);
            }}
            onSearch={() => onFilter(nameFilter)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onFilter(nameFilter);
              }
            }}
            onClear={() => {
              setNameFilter("");
              onFilter("");
            }}
          />
        </ToolbarItem>
        <ToolbarItem variant="pagination">
          <Pagination
            isCompact
            perPageOptions={[
              { title: "5", value: 6 },
              { title: "10", value: 11 },
              { title: "20", value: 21 },
            ]}
            toggleTemplate={({
              firstIndex,
              lastIndex,
            }: PaginationToggleTemplateProps) => (
              <b>
                {firstIndex && firstIndex > 1 ? firstIndex - 1 : firstIndex} -{" "}
                {lastIndex && lastIndex > 1 ? lastIndex - 1 : lastIndex}
              </b>
            )}
            itemCount={count + (page - 1) * max + (hasNext ? 1 : 0)}
            page={page}
            perPage={max}
            onNextClick={(_, p) => onNextClick((p - 1) * max)}
            onPreviousClick={(_, p) => onPreviousClick((p - 1) * max)}
            onPerPageSelect={(_, m, f) => onPerPageSelect(f - 1, m)}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
