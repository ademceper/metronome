/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/table/PaginatingTableToolbar.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button } from "@metronome/ui/components/button";
import {
  CaretLeft as CaretLeftIcon,
  CaretRight as CaretRightIcon,
} from "@phosphor-icons/react";
import { PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { TableToolbar } from "./TableToolbar";

type KeycloakPaginationProps = {
  id?: string;
  count: number;
  first: number;
  max: number;
  onNextClick: (page: number) => void;
  onPreviousClick: (page: number) => void;
  onPerPageSelect: (max: number, first: number) => void;
  variant?: "top" | "bottom";
};

type TableToolbarProps = KeycloakPaginationProps & {
  searchTypeComponent?: ReactNode;
  toolbarItem?: ReactNode;
  subToolbar?: ReactNode;
  inputGroupName?: string;
  inputGroupPlaceholder?: string;
  inputGroupOnEnter?: (value: string) => void;
};

const PAGE_SIZES = [5, 10, 25, 50, 100];

const KeycloakPagination = ({
  count,
  first,
  max,
  onNextClick,
  onPreviousClick,
  onPerPageSelect,
  variant = "top",
}: KeycloakPaginationProps) => {
  const { t } = useTranslation();
  const page = Math.round(first / max);
  const itemCount = count + page * max;
  const firstIndex = itemCount === 0 ? 0 : page * max + 1;
  const lastIndex = Math.min(page * max + max, itemCount);
  const hasNext = count > max;
  const hasPrev = page > 0;

  return (
    <div
      aria-label={`${t("pagination")} ${variant}`}
      className="flex items-center gap-2"
    >
      {variant === "top" && (
        <select
          aria-label={t("perPage") || "Per page"}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(e) => onPerPageSelect(0, Number(e.target.value))}
          value={max}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      )}
      <span className="whitespace-nowrap text-muted-foreground text-sm">
        <b className="text-foreground">
          {firstIndex} - {lastIndex}
        </b>
      </span>
      <div className="flex items-center gap-1">
        <Button
          aria-label={t("previousPage") || "Previous page"}
          disabled={!hasPrev}
          onClick={() => onPreviousClick(Math.max(0, (page - 1) * max))}
          size="icon"
          variant="outline"
          className="size-7"
        >
          <CaretLeftIcon aria-hidden="true" size={14} />
        </Button>
        <Button
          aria-label={t("nextPage") || "Next page"}
          disabled={!hasNext}
          onClick={() => onNextClick((page + 1) * max)}
          size="icon"
          variant="outline"
          className="size-7"
        >
          <CaretRightIcon aria-hidden="true" size={14} />
        </Button>
      </div>
    </div>
  );
};

export const PaginatingTableToolbar = ({
  count,
  searchTypeComponent,
  toolbarItem,
  subToolbar,
  children,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnEnter,
  ...rest
}: PropsWithChildren<TableToolbarProps>) => {
  return (
    <TableToolbar
      searchTypeComponent={searchTypeComponent}
      toolbarItem={
        <>
          {toolbarItem}
          <KeycloakPagination count={count} {...rest} />
        </>
      }
      subToolbar={subToolbar}
      toolbarItemFooter={
        count !== 0 ? (
          <KeycloakPagination count={count} variant="bottom" {...rest} />
        ) : null
      }
      inputGroupName={inputGroupName}
      inputGroupPlaceholder={inputGroupPlaceholder}
      inputGroupOnEnter={inputGroupOnEnter}
    >
      {children}
    </TableToolbar>
  );
};
