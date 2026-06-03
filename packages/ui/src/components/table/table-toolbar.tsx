"use client"

import { Input } from "@metronome/ui/components/input"
import { TablePaginationFooter } from "@metronome/ui/components/table/table-pagination-footer"
import { cn } from "@metronome/ui/lib/utils"
import { MagnifyingGlassIcon, XCircleIcon } from "@phosphor-icons/react"
import {
  type KeyboardEvent,
  type PropsWithChildren,
  type ReactNode,
  useState,
} from "react"

type TableToolbarBaseProps = {
  toolbarItem?: ReactNode
  subToolbar?: ReactNode
  toolbarItemFooter?: ReactNode
  searchTypeComponent?: ReactNode
  inputGroupName?: string
  inputGroupPlaceholder?: string
  inputGroupOnEnter?: (value: string) => void
  searchAriaLabel?: string
  clearSearchAriaLabel?: string
}

export const TableToolbar = ({
  toolbarItem,
  subToolbar,
  toolbarItemFooter,
  children,
  searchTypeComponent,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnEnter,
  searchAriaLabel = "Search",
  clearSearchAriaLabel = "Clear search",
}: PropsWithChildren<TableToolbarBaseProps>) => {
  const [searchValue, setSearchValue] = useState<string>("")

  const onSearch = (value: string) => {
    const trimmed = value.trim()
    setSearchValue(trimmed)
    inputGroupOnEnter?.(trimmed)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch(searchValue)
  }

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
                  aria-label={searchAriaLabel}
                  className={cn(
                    "peer min-w-60 ps-9",
                    searchValue.length > 0 && "pe-9"
                  )}
                  data-testid="table-search-input"
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={inputGroupPlaceholder}
                  type="text"
                  value={searchValue}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
                  <MagnifyingGlassIcon aria-hidden="true" size={16} />
                </div>
                {searchValue.length > 0 && (
                  <button
                    aria-label={clearSearchAriaLabel}
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
      {subToolbar && (
        <div className="flex items-center gap-2">{subToolbar}</div>
      )}
      {children}
      {toolbarItemFooter && (
        <div className="flex items-center justify-end">{toolbarItemFooter}</div>
      )}
    </div>
  )
}

// ─── PaginatingTableToolbar ────────────────────────────────────────────────

type PaginationProps = {
  id?: string
  count: number
  first: number
  max: number
  onNextClick: (page: number) => void
  onPreviousClick: (page: number) => void
  onPerPageSelect: (max: number, first: number) => void
}

type PaginatingTableToolbarProps = PaginationProps & TableToolbarBaseProps

const PAGE_SIZES = [10, 20, 50]

export const PaginatingTableToolbar = ({
  count,
  first,
  max,
  onNextClick,
  onPreviousClick,
  onPerPageSelect,
  searchTypeComponent,
  toolbarItem,
  subToolbar,
  children,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnEnter,
  searchAriaLabel,
  clearSearchAriaLabel,
}: PropsWithChildren<PaginatingTableToolbarProps>) => {
  const page = Math.round(first / max)
  const hasNextPage = count > max
  const hasPreviousPage = page > 0

  return (
    <TableToolbar
      searchTypeComponent={searchTypeComponent}
      toolbarItem={toolbarItem}
      subToolbar={subToolbar}
      toolbarItemFooter={
        count !== 0 ? (
          <TablePaginationFooter
            pageSize={max}
            currentPageItemsCount={count}
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            onPreviousPage={() =>
              onPreviousClick(Math.max(0, (page - 1) * max))
            }
            onNextPage={() => onNextClick((page + 1) * max)}
            onPageSizeChange={(size) => onPerPageSelect(0, size)}
            pageSizeOptions={PAGE_SIZES}
            className="w-full justify-end"
          />
        ) : null
      }
      inputGroupName={inputGroupName}
      inputGroupPlaceholder={inputGroupPlaceholder}
      inputGroupOnEnter={inputGroupOnEnter}
      searchAriaLabel={searchAriaLabel}
      clearSearchAriaLabel={clearSearchAriaLabel}
    >
      {children}
    </TableToolbar>
  )
}
