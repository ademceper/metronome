"use client"

import { cn } from "@metronome/ui/lib/utils"
import {
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react"
import { cva } from "class-variance-authority"
import * as React from "react"

export type TableSortDirection = "asc" | "desc" | false

interface TableProps
  extends Omit<React.HTMLAttributes<HTMLTableElement>, "children"> {
  containerClassName?: string
  isLoading?: boolean
  loadingRowsCount?: number
  loadingRow?: React.ReactNode
  children?: React.ReactNode
}

const LoadingRow = () => (
  <TableRow>
    <TableCell className="animate-pulse" colSpan={100}>
      <div className="h-8 w-full rounded-md bg-neutral-100" />
    </TableCell>
  </TableRow>
)

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      isLoading,
      loadingRowsCount = 5,
      loadingRow,
      children,
      ...props
    },
    ref
  ) => (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-x-auto rounded-lg border border-neutral-200 shadow-xs",
        containerClassName
      )}
    >
      <table
        ref={ref}
        data-slot="table"
        className={cn(
          "relative w-full caption-bottom border-separate border-spacing-0 text-sm",
          className
        )}
        {...props}
      >
        {children}
        {isLoading && (
          <TableBody>
            {Array.from({ length: loadingRowsCount }).map((_, index) => (
              <React.Fragment key={index}>
                {loadingRow ?? <LoadingRow />}
              </React.Fragment>
            ))}
          </TableBody>
        )}
      </table>
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="table-header"
    className={cn(
      "sticky top-0 z-10 bg-neutral-50 shadow-[0_0_0_1px_var(--color-neutral-200)]",
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

interface TableHeadProps
  extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "children"> {
  sortable?: boolean
  sortDirection?: TableSortDirection
  onSort?: () => void
  children?: React.ReactNode
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable, sortDirection, onSort, ...props }, ref) => {
    const content = (
      <div
        className={cn(
          "flex items-center gap-1",
          sortable && "cursor-pointer hover:text-neutral-900"
        )}
      >
        {children}
        {sortable ? (
          sortDirection === "asc" ? (
            <CaretUpIcon className="size-4 text-neutral-600" />
          ) : sortDirection === "desc" ? (
            <CaretDownIcon className="size-4 text-neutral-600" />
          ) : (
            <CaretUpDownIcon className="size-4 text-neutral-600" />
          )
        ) : null}
      </div>
    )

    return (
      <th
        ref={ref}
        data-slot="table-head"
        className={cn(
          "h-10 whitespace-nowrap px-6 py-2 text-left align-middle font-medium text-neutral-600 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          className
        )}
        {...props}
      >
        {sortable ? (
          <div role="button" tabIndex={0} onClick={onSort}>
            {content}
          </div>
        ) : (
          content
        )}
      </th>
    )
  }
)
TableHead.displayName = "TableHead"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn("", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="table-footer"
    className={cn(
      "sticky bottom-0 bg-background shadow-[0_0_0_1px_var(--color-neutral-200)]",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    data-slot="table-row"
    className={cn(
      "[&>td]:border-neutral-100 [&>td]:border-b last-of-type:[&>td]:border-0",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

export const tableCellVariants = cva("px-6 py-2 align-middle")

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    data-slot="table-cell"
    className={cn(tableCellVariants(), className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn("mt-4 text-muted-foreground text-sm", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
