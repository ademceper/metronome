"use client"

import { Button } from "@metronome/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@metronome/ui/components/select"
import { cn } from "@metronome/ui/lib/utils"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import type * as React from "react"

function PaginationGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-neutral-200 bg-background">
      {children}
    </div>
  )
}

function PaginationNavButton({
  children,
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
  "aria-label"?: string
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className="h-7 w-8 rounded-none border-0 border-r border-neutral-200 p-1.5 text-neutral-600 last:border-r-0 hover:text-neutral-950 disabled:text-neutral-300"
    >
      {children}
    </Button>
  )
}

export type TablePaginationFooterProps = {
  pageSize: number
  currentPageItemsCount?: number
  onPreviousPage: () => void
  onNextPage: () => void
  onPageSizeChange: (pageSize: number) => void
  hasPreviousPage: boolean
  hasNextPage: boolean
  className?: string
  pageSizeOptions?: number[]
  itemName?: string
  totalCountCapped?: boolean
  totalCount?: number
}

export function TablePaginationFooter({
  pageSize,
  onPreviousPage,
  onNextPage,
  onPageSizeChange,
  hasPreviousPage,
  hasNextPage,
  className,
  pageSizeOptions = [10, 20, 50],
  totalCountCapped,
  totalCount,
  itemName = "results",
}: TablePaginationFooterProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center bg-background px-3 py-2",
        className
      )}
    >
      <div className="flex flex-1 items-center gap-1 px-2 pl-0">
        {totalCount !== undefined && (
          <>
            {totalCountCapped ? (
              <span className="font-medium text-neutral-600 text-xs">
                Over 50,000
              </span>
            ) : (
              <span className="font-medium text-neutral-600 text-xs">
                {totalCount.toLocaleString()}
              </span>
            )}
            <span className="text-neutral-400 text-xs">{itemName}</span>
          </>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <PaginationGroup>
          <PaginationNavButton
            disabled={!hasPreviousPage}
            onClick={onPreviousPage}
            aria-label="Go to previous page"
          >
            <CaretLeftIcon className="size-4" />
          </PaginationNavButton>
          <PaginationNavButton
            disabled={!hasNextPage}
            onClick={onNextPage}
            aria-label="Go to next page"
          >
            <CaretRightIcon className="size-4" />
          </PaginationNavButton>
        </PaginationGroup>
      </div>

      <div className="flex flex-1 items-center justify-end">
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-7 w-auto min-w-[80px] rounded-lg border border-neutral-200 bg-background px-2 py-1 shadow-xs">
            <SelectValue>
              <span className="font-medium text-neutral-600 text-xs">
                {pageSize}
              </span>
              <span className="ml-1 text-neutral-400 text-xs">/ page</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
