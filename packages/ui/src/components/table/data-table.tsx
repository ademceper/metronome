"use client"

import { Button } from "@metronome/ui/components/button"
import { Checkbox } from "@metronome/ui/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@metronome/ui/components/dropdown-menu"
import { Input } from "@metronome/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@metronome/ui/components/table/table"
import { TablePaginationFooter } from "@metronome/ui/components/table/table-pagination-footer"
import { cn } from "@metronome/ui/lib/utils"
import {
  ArrowsClockwiseIcon,
  CaretDownIcon,
  CaretRightIcon,
  DotsThreeIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
import {
  type ComponentType,
  Fragment,
  isValidElement,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"

// ─── Types (kept identical to legacy KeycloakDataTable) ────────────────────

type SVGIconProps = React.SVGProps<SVGSVGElement>

type TitleCell = { title: JSX.Element }
type Cell<T> = keyof T | JSX.Element | TitleCell

type BaseRow<T> = {
  data: T
  cells: Cell<T>[]
}

type Row<T> = BaseRow<T> & {
  selected: boolean
  isOpen?: boolean
  disableSelection: boolean
  disableActions: boolean
}

type SubRow<T> = BaseRow<T> & {
  parent: number
}

export type Field<T> = {
  name: string
  displayKey?: string
  cellFormatters?: Array<(v: unknown) => unknown>
  transforms?: unknown[]
  cellRenderer?: (row: T) => JSX.Element | string
}

export type DetailField<T> = {
  name: string
  enabled?: (row: T) => boolean
  cellRenderer?: (row: T) => JSX.Element | string
}

export type Action<T> = {
  title: ReactNode
  isSeparator?: boolean
  isDisabled?: boolean
  onRowClick?: (row: T) => Promise<boolean | undefined> | undefined
  onClick?: (event: unknown, rowIndex: number, rowData?: unknown) => void
  [key: string]: unknown
}

export type LoaderFunction<T> = (
  first?: number,
  max?: number,
  search?: string
) => Promise<T[]>

export type DataTableProps<T> = {
  loader: T[] | LoaderFunction<T>
  onSelect?: (value: T[]) => void
  canSelectAll?: boolean
  detailColumns?: DetailField<T>[]
  isRowDisabled?: (value: T) => boolean
  isPaginated?: boolean
  ariaLabel?: string
  /** @deprecated pass already-translated `ariaLabel` instead. */
  ariaLabelKey?: string
  searchPlaceholder?: string
  /** @deprecated pass already-translated `searchPlaceholder` instead. */
  searchPlaceholderKey?: string
  columns: Field<T>[]
  actions?: Action<T>[]
  actionResolver?: (rowData: unknown, extra?: unknown) => Action<T>[]
  searchTypeComponent?: ReactNode
  toolbarItem?: ReactNode
  subToolbar?: ReactNode
  emptyState?: ReactNode
  emptySearchState?: ReactNode
  icon?: ComponentType<SVGIconProps>
  isNotCompact?: boolean
  isRadio?: boolean
  isSearching?: boolean
  /**
   * Optional translation function. Column `displayKey`/`name` and built-in
   * UI strings ("refresh", "actions", "selectAll", "selectRow") get passed
   * through this. Defaults to identity, so consumers without i18n can pass
   * already-translated strings as `displayKey`.
   */
  t?: (key: string) => string
}

// ─── Internal helpers ──────────────────────────────────────────────────────

const isTitleCell = (c: unknown): c is TitleCell =>
  !!c && typeof c === "object" && (c as TitleCell).title !== undefined

const renderCellContent = (cell: unknown): ReactNode => {
  if (isTitleCell(cell)) return cell.title
  return cell as ReactNode
}

const get = (obj: unknown, path: string): unknown => {
  if (obj == null || typeof obj !== "object") return undefined
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

function useStoredState<S>(
  storageArea: Storage,
  key: string,
  defaultValue: S
): [S, (v: S) => void] {
  const [value, setValue] = useState<S>(() => {
    try {
      const raw = storageArea.getItem(key)
      return raw === null ? defaultValue : (JSON.parse(raw) as S)
    } catch {
      return defaultValue
    }
  })
  const set = (next: S) => {
    setValue(next)
    try {
      storageArea.setItem(key, JSON.stringify(next))
    } catch {
      // ignore
    }
  }
  return [value, set]
}

const RowActionsMenu = ({
  items,
  rowIndex,
  rowData,
}: {
  items: Action<unknown>[]
  rowIndex: number
  rowData: unknown
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        aria-label="Row actions"
        className="shadow-none"
        size="icon"
        variant="ghost"
      >
        <DotsThreeIcon aria-hidden="true" size={16} />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {items.map((action, i) => {
        if (action.isSeparator) {
          return <DropdownMenuSeparator key={`sep-${i}`} />
        }
        return (
          <DropdownMenuItem
            key={`action-${i}`}
            disabled={action.isDisabled}
            onSelect={(event) => action.onClick?.(event, rowIndex, rowData)}
          >
            {action.title}
          </DropdownMenuItem>
        )
      })}
    </DropdownMenuContent>
  </DropdownMenu>
)

// ─── Inner table (one render of rows + columns) ───────────────────────────

type InnerTableProps<T> = {
  ariaLabel?: string
  columns: Field<T>[]
  rows: (Row<T> | SubRow<T>)[]
  actions?: Action<T>[]
  actionResolver?: (rowData: unknown, extra?: unknown) => Action<T>[]
  selected?: T[]
  onSelect?: (value: T[]) => void
  onCollapse?: (isOpen: boolean, rowIndex: number) => void
  canSelectAll: boolean
  canSelect: boolean
  isNotCompact?: boolean
  isRadio?: boolean
  footer?: React.ReactNode
  t: (key: string) => string
}

function InnerTable<T>({
  columns,
  rows,
  actions,
  actionResolver,
  ariaLabel,
  selected,
  onSelect,
  onCollapse,
  canSelectAll,
  canSelect,
  isNotCompact,
  isRadio,
  footer,
  t,
}: InnerTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>(selected ?? [])
  const [expandedRows, setExpandedRows] = useState<boolean[]>([])

  const dataRows = useMemo(
    () =>
      onCollapse ? rows.filter((_, idx) => idx % 2 === 0) : (rows as Row<T>[]),
    [rows, onCollapse]
  )

  const rowsSelectedOnPage = useMemo(() => {
    const ids = new Set(dataRows.map((r) => get(r.data, "id")))
    return selectedRows.filter((v) => ids.has(get(v, "id")))
  }, [selectedRows, dataRows])

  const updateSelectedRows = (next: T[]) => {
    setSelectedRows(next)
    onSelect?.(next)
  }

  const isRowSelected = (row: Row<T>) =>
    !!selectedRows.find((v) => get(v, "id") === get(row.data, "id"))

  const toggleRow = (row: Row<T>, checked: boolean) => {
    if (isRadio) {
      updateSelectedRows(checked ? [row.data] : [])
      return
    }
    if (checked) {
      updateSelectedRows([...selectedRows, row.data])
    } else {
      updateSelectedRows(
        selectedRows.filter((v) => get(v, "id") !== get(row.data, "id"))
      )
    }
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const ids = new Set(selectedRows.map((v) => get(v, "id")))
      const next = [...selectedRows]
      for (const r of dataRows) {
        if (!ids.has(get(r.data, "id"))) next.push(r.data)
      }
      updateSelectedRows(next)
    } else {
      const ids = new Set(dataRows.map((r) => get(r.data, "id")))
      updateSelectedRows(selectedRows.filter((v) => !ids.has(get(v, "id"))))
    }
  }

  const allChecked =
    dataRows.length > 0 && rowsSelectedOnPage.length === dataRows.length
  const someChecked =
    rowsSelectedOnPage.length > 0 && rowsSelectedOnPage.length < dataRows.length

  const colCount =
    columns.length +
    (canSelect ? 1 : 0) +
    (onCollapse ? 1 : 0) +
    (actions || actionResolver ? 1 : 0)

  return (
    <Table aria-label={ariaLabel} className={isNotCompact ? "" : "text-sm"}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {onCollapse && <TableHead className="w-8" aria-hidden="true" />}
          {canSelectAll && (
            <TableHead className="w-10">
              {!isRadio && (
                <Checkbox
                  aria-label={t("selectAll")}
                  checked={
                    allChecked ? true : someChecked ? "indeterminate" : false
                  }
                  onCheckedChange={(value) => toggleAll(!!value)}
                />
              )}
            </TableHead>
          )}
          {canSelect && !canSelectAll && <TableHead className="w-10" />}
          {columns.map((column) => (
            <TableHead key={column.displayKey ?? column.name}>
              {t(column.displayKey ?? column.name)}
            </TableHead>
          ))}
          {(actions || actionResolver) && (
            <TableHead className="w-12 text-end">
              <span className="sr-only">{t("actions")}</span>
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {!onCollapse
          ? (rows as Row<T>[]).map((row, index) => {
              const items =
                actions ?? actionResolver?.(row, { rowIndex: index }) ?? []
              return (
                <TableRow
                  key={index}
                  data-state={isRowSelected(row) ? "selected" : undefined}
                >
                  {canSelect && (
                    <TableCell>
                      <Checkbox
                        aria-label={t("selectRow")}
                        checked={isRowSelected(row)}
                        disabled={row.disableSelection}
                        onCheckedChange={(value) => toggleRow(row, !!value)}
                      />
                    </TableCell>
                  )}
                  {row.cells.map((c, i) => (
                    <TableCell key={`cell-${i}`}>
                      {renderCellContent(c)}
                    </TableCell>
                  ))}
                  {(actions || actionResolver) && (
                    <TableCell className="text-end">
                      {items.length > 0 && !row.disableActions && (
                        <RowActionsMenu
                          items={items as Action<unknown>[]}
                          rowIndex={index}
                          rowData={row}
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })
          : (rows as Row<T>[]).map((row, index) => {
              if (index % 2 !== 0) return null
              const next = rows[index + 1] as SubRow<T> | undefined
              const isExpandable = !!next && next.cells.length > 0
              const expanded = expandedRows[index] ?? false
              const items =
                actions ?? actionResolver?.(row, { rowIndex: index }) ?? []
              return (
                <Fragment key={index}>
                  <TableRow
                    data-state={isRowSelected(row) ? "selected" : undefined}
                  >
                    <TableCell className="w-8">
                      {isExpandable && (
                        <Button
                          aria-label={
                            expanded ? t("collapseRow") : t("expandRow")
                          }
                          className="size-6 p-0"
                          onClick={() => {
                            const open = !expanded
                            onCollapse(open, index)
                            const updated = [...expandedRows]
                            updated[index] = open
                            setExpandedRows(updated)
                          }}
                          size="icon"
                          variant="ghost"
                        >
                          {expanded ? (
                            <CaretDownIcon aria-hidden="true" size={14} />
                          ) : (
                            <CaretRightIcon aria-hidden="true" size={14} />
                          )}
                        </Button>
                      )}
                    </TableCell>
                    {row.cells.map((c, i) => (
                      <TableCell key={`cell-${i}`}>
                        {renderCellContent(c)}
                      </TableCell>
                    ))}
                    {(actions || actionResolver) && (
                      <TableCell className="text-end">
                        {items.length > 0 && !row.disableActions && (
                          <RowActionsMenu
                            items={items as Action<unknown>[]}
                            rowIndex={index}
                            rowData={row}
                          />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                  {expanded && next && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell />
                      <TableCell colSpan={colCount - 1}>
                        {next.cells.map((c, i) => (
                          <div key={`sub-${i}`}>{renderCellContent(c)}</div>
                        ))}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}
      </TableBody>
      {footer ? (
        <TableFooter className="border-neutral-200 border-t">
          <TableRow>
            <TableCell colSpan={colCount} className="p-0">
              {footer}
            </TableCell>
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  )
}

// ─── Toolbar (search input + custom items + optional sub-toolbar) ─────────

type ToolbarProps = {
  searchValue: string
  onSearchChange: (v: string) => void
  searchPlaceholder?: string
  searchTypeComponent?: ReactNode
  toolbarItem?: ReactNode
  subToolbar?: ReactNode
  t: (key: string) => string
}

function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchTypeComponent,
  toolbarItem,
  subToolbar,
  t,
}: ToolbarProps) {
  const [draft, setDraft] = useState(searchValue)

  useEffect(() => {
    setDraft(searchValue)
  }, [searchValue])

  const commit = (value: string) => {
    const trimmed = value.trim()
    setDraft(trimmed)
    onSearchChange(trimmed)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit(draft)
  }

  const showSearch = !!searchPlaceholder
  return (
    <div className="space-y-4">
      <div
        data-testid="table-toolbar"
        className="flex flex-wrap items-center gap-3"
      >
        {showSearch && (
          <div className="flex items-center gap-2">
            {searchTypeComponent}
            <div className="relative">
              <Input
                aria-label={t("search")}
                className={cn("peer min-w-60 ps-9", draft.length > 0 && "pe-9")}
                data-testid="table-search-input"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                type="text"
                value={draft}
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
                <MagnifyingGlassIcon aria-hidden="true" size={16} />
              </div>
              {draft.length > 0 && (
                <button
                  aria-label="Clear search"
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none hover:text-foreground"
                  onClick={() => commit("")}
                  type="button"
                >
                  <XCircleIcon aria-hidden="true" size={16} />
                </button>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">{toolbarItem}</div>
      </div>
      {subToolbar && (
        <div className="flex items-center gap-2">{subToolbar}</div>
      )}
    </div>
  )
}

// ─── Public component ─────────────────────────────────────────────────────

const identity = (k: string) => k

export function DataTable<T>({
  ariaLabel,
  ariaLabelKey,
  searchPlaceholder,
  searchPlaceholderKey,
  isPaginated = false,
  onSelect,
  canSelectAll = false,
  isNotCompact,
  isRadio,
  detailColumns,
  isRowDisabled,
  loader,
  columns,
  actions,
  actionResolver,
  searchTypeComponent,
  toolbarItem,
  subToolbar,
  emptyState,
  emptySearchState,
  isSearching = false,
  t = identity,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<T[]>([])
  const [rows, setRows] = useState<(Row<T> | SubRow<T>)[]>()
  const [unPaginatedData, setUnPaginatedData] = useState<T[]>()
  const [loading, setLoading] = useState(false)

  const [defaultPageSize, setDefaultPageSize] = useStoredState<number>(
    typeof window === "undefined" ? ({} as Storage) : window.localStorage,
    "pageSize",
    10
  )

  const [max, setMax] = useState(defaultPageSize)
  const [first, setFirst] = useState(0)
  const [search, setSearch] = useState<string>("")
  const prevSearch = useRef<string>("")
  const [key, setKey] = useState(0)
  const prevKey = useRef<number | undefined>(undefined)
  const refresh = () => setKey((k) => k + 1)
  const id = useId()

  const resolvedAriaLabel =
    ariaLabel ?? (ariaLabelKey ? t(ariaLabelKey) : undefined)
  const resolvedSearchPlaceholder =
    searchPlaceholder ??
    (searchPlaceholderKey ? t(searchPlaceholderKey) : undefined)

  const renderCell = (cols: (Field<T> | DetailField<T>)[], value: T) =>
    cols.map((col) => {
      if ("cellFormatters" in col && col.cellFormatters) {
        const v = get(value, col.name)
        return col.cellFormatters.reduce<unknown>((s, f) => f(s), v)
      }
      if (col.cellRenderer) {
        const Component = col.cellRenderer as ComponentType<T>
        return { title: <Component {...(value as T & object)} /> }
      }
      return get(value, col.name)
    })

  const convertToColumns = (data: T[]): (Row<T> | SubRow<T>)[] => {
    const isDetailColumnsEnabled = (value: T) =>
      detailColumns?.[0]?.enabled?.(value)
    return data.flatMap((value, index) => {
      const disabledRow = isRowDisabled ? isRowDisabled(value) : false
      const row: (Row<T> | SubRow<T>)[] = [
        {
          data: value,
          disableSelection: disabledRow,
          disableActions: disabledRow,
          selected: !!selected.find((v) => get(v, "id") === get(value, "id")),
          isOpen: isDetailColumnsEnabled(value) ? false : undefined,
          cells: renderCell(columns, value) as Cell<T>[],
        },
      ]
      if (detailColumns) {
        row.push({
          parent: index * 2,
          cells: (isDetailColumnsEnabled(value)
            ? renderCell(detailColumns, value)
            : []) as Cell<T>[],
        } as SubRow<T>)
      }
      return row
    })
  }

  const getNodeText = (node: Cell<T>): string => {
    if (typeof node === "string" || typeof node === "number") {
      return node.toString()
    }
    if (Array.isArray(node)) {
      return node.map(getNodeText).join("")
    }
    if (typeof node === "object" && node !== null) {
      const titleNode = (node as TitleCell).title
      if (titleNode) {
        return getNodeText(
          (isValidElement(titleNode)
            ? (titleNode.props as Record<string, unknown>)
            : Object.values(node as Record<string, unknown>)) as Cell<T>
        )
      }
      return getNodeText(Object.values(node) as unknown as Cell<T>)
    }
    return ""
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: closure intentionally re-runs only on search/page changes
  const filteredData = useMemo<(Row<T> | SubRow<T>)[] | undefined>(
    () =>
      search === "" || isPaginated
        ? undefined
        : convertToColumns(unPaginatedData ?? [])
            .filter((row) =>
              row.cells.some(
                (cell) =>
                  cell &&
                  getNodeText(cell).toLowerCase().includes(search.toLowerCase())
              )
            )
            .slice(first, first + max + 1),
    [search, first, max]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: loader closure intentionally captures stable values
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    setLoading(true)
    const newSearch = prevSearch.current === "" && search !== ""
    if (newSearch) setFirst(0)
    prevSearch.current = search

    const promise =
      typeof loader === "function"
        ? key === prevKey.current && unPaginatedData
          ? Promise.resolve(unPaginatedData)
          : loader(newSearch ? 0 : first, max + 1, search)
        : Promise.resolve(loader)

    promise
      .then((data) => {
        if (signal.aborted) return
        prevKey.current = key
        let nextData = data
        if (!isPaginated) {
          setUnPaginatedData(data)
          if (data.length > first) {
            nextData = data.slice(first, first + max + 1)
          } else {
            setFirst(0)
          }
        }
        setRows(convertToColumns(nextData))
        setLoading(false)
      })
      .catch((error) => {
        if (signal.aborted) return
        console.error(error)
        setLoading(false)
      })

    return () => controller.abort()
  }, [key, first, max, search, loader])

  const convertAction = () =>
    actions?.map((action, index) => {
      const copy: Action<T> = { ...action }
      delete copy.onRowClick
      copy.onClick = async (_event, rowIndex) => {
        const target = (filteredData ?? rows)?.[rowIndex]
        if (!target) return
        const result = await actions[index]?.onRowClick?.(target.data)
        if (result) {
          if (!isPaginated) setSearch("")
          refresh()
        }
      }
      return copy
    })

  const onCollapse = (isOpen: boolean, rowIndex: number) => {
    if (!data) return
    ;(data[rowIndex] as Row<T>).isOpen = isOpen
    setRows([...data])
  }

  const data = filteredData ?? rows
  const noData = !data || data.length === 0
  const searching = search !== "" || isSearching
  const maxRows = detailColumns ? max * 2 : max
  const rowLength = detailColumns
    ? (data?.length ?? 0) / 2
    : (data?.length ?? 0)
  const page = Math.round(first / max)
  const hasNextPage = rowLength > max
  const hasPreviousPage = page > 0
  // Loader fetches max+1 to detect "has more" — clamp the displayed count
  // back to the page size so the footer reports 10/20/50 and not 11/21/51.
  const visibleRowCount = Math.min(rowLength, max)

  return (
    <>
      {(!noData || searching) && (
        <div className="space-y-2">
          <DataTableToolbar
            searchValue={search}
            onSearchChange={(v) => {
              setFirst(0)
              setSearch(v)
            }}
            searchPlaceholder={resolvedSearchPlaceholder}
            searchTypeComponent={searchTypeComponent}
            toolbarItem={
              <>
                {toolbarItem}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refresh}
                  data-testid="refresh"
                >
                  <ArrowsClockwiseIcon aria-hidden="true" size={14} />{" "}
                  {t("refresh")}
                </Button>
              </>
            }
            subToolbar={subToolbar}
            t={t}
          />
          {!loading && !noData && (
            <InnerTable<T>
              ariaLabel={resolvedAriaLabel}
              columns={columns}
              rows={data.slice(0, maxRows)}
              actions={convertAction()}
              actionResolver={actionResolver}
              selected={selected}
              onSelect={(next) => {
                setSelected(next)
                onSelect?.(next)
              }}
              onCollapse={detailColumns ? onCollapse : undefined}
              canSelect={!!onSelect}
              canSelectAll={canSelectAll}
              isNotCompact={isNotCompact}
              isRadio={isRadio}
              t={t}
              footer={
                rowLength > 0 ? (
                  <TablePaginationFooter
                    pageSize={max}
                    currentPageItemsCount={visibleRowCount}
                    totalCount={
                      isPaginated || !unPaginatedData
                        ? visibleRowCount
                        : unPaginatedData.length
                    }
                    hasPreviousPage={hasPreviousPage}
                    hasNextPage={hasNextPage}
                    onPreviousPage={() =>
                      setFirst(Math.max(0, (page - 1) * max))
                    }
                    onNextPage={() => setFirst((page + 1) * max)}
                    onPageSizeChange={(size) => {
                      setFirst(0)
                      setMax(size)
                      setDefaultPageSize(size)
                    }}
                    pageSizeOptions={[10, 20, 50]}
                    className="bg-transparent shadow-none"
                  />
                ) : null
              }
            />
          )}
          {!loading && noData && searching && (emptySearchState ?? null)}
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
          {t("loading")}
        </div>
      )}
      {!loading && noData && !searching && emptyState}
      <span hidden data-table-id={id} />
    </>
  )
}
