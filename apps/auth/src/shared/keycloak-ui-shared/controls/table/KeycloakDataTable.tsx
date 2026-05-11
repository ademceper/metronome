/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/table/KeycloakDataTable.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button } from "@metronome/ui/components/button";
import { Checkbox } from "@metronome/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@metronome/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@metronome/ui/components/table";
import { cn } from "@metronome/ui/lib/utils";
import {
  ArrowsClockwise as SyncAltIcon,
  CaretDown as CaretDownIcon,
  CaretRight as CaretRightIcon,
  CaretUp as CaretUpIcon,
  DotsThree as DotsThreeIcon,
} from "@phosphor-icons/react";
import { cloneDeep, get } from "lodash-es";
import {
  ComponentType,
  Fragment,
  ReactNode,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../utils/useFetch";
import { useStoredState } from "../../utils/useStoredState";
import { KeycloakSpinner } from "../KeycloakSpinner";
import { ListEmptyState } from "./ListEmptyState";
import { PaginatingTableToolbar } from "./PaginatingTableToolbar";

type SVGIconProps = React.SVGProps<SVGSVGElement>;

type TitleCell = { title: JSX.Element };
type Cell<T> = keyof T | JSX.Element | TitleCell;

type BaseRow<T> = {
  data: T;
  cells: Cell<T>[];
};

type Row<T> = BaseRow<T> & {
  selected: boolean;
  isOpen?: boolean;
  disableSelection: boolean;
  disableActions: boolean;
};

type SubRow<T> = BaseRow<T> & {
  parent: number;
};

export type Field<T> = {
  name: string;
  displayKey?: string;
  cellFormatters?: any[];
  transforms?: any[];
  cellRenderer?: (row: T) => JSX.Element | string;
};

export type DetailField<T> = {
  name: string;
  enabled?: (row: T) => boolean;
  cellRenderer?: (row: T) => JSX.Element | string;
};

export type Action<T> = {
  title: ReactNode;
  isSeparator?: boolean;
  isDisabled?: boolean;
  onRowClick?: (row: T) => Promise<boolean | void> | void;
  onClick?: (event: any, rowIndex: number, rowData?: any) => void;
  [key: string]: any;
};

export type LoaderFunction<T> = (
  first?: number,
  max?: number,
  search?: string,
) => Promise<T[]>;

export type DataListProps<T> = {
  loader: T[] | LoaderFunction<T>;
  onSelect?: (value: T[]) => void;
  canSelectAll?: boolean;
  detailColumns?: DetailField<T>[];
  isRowDisabled?: (value: T) => boolean;
  isPaginated?: boolean;
  ariaLabelKey: string;
  searchPlaceholderKey?: string;
  columns: Field<T>[];
  actions?: Action<T>[];
  actionResolver?: (rowData: any, extra?: any) => Action<T>[];
  searchTypeComponent?: ReactNode;
  toolbarItem?: ReactNode;
  subToolbar?: ReactNode;
  emptyState?: ReactNode;
  icon?: ComponentType<SVGIconProps>;
  isNotCompact?: boolean;
  isRadio?: boolean;
  isSearching?: boolean;
  [key: string]: any;
};

const isTitleCell = (c: any): c is TitleCell =>
  !!c && typeof c === "object" && (c as TitleCell).title !== undefined;

const renderCellContent = (cell: any): ReactNode => {
  if (isTitleCell(cell)) return cell.title as ReactNode;
  return cell as ReactNode;
};

type DataTableProps<T> = {
  ariaLabelKey: string;
  columns: Field<T>[];
  rows: (Row<T> | SubRow<T>)[];
  actions?: Action<T>[];
  actionResolver?: (rowData: any, extra?: any) => Action<T>[];
  selected?: T[];
  onSelect?: (value: T[]) => void;
  onCollapse?: (isOpen: boolean, rowIndex: number) => void;
  canSelectAll: boolean;
  canSelect: boolean;
  isNotCompact?: boolean;
  isRadio?: boolean;
};

const RowActionsMenu = ({
  items,
  rowIndex,
  rowData,
}: {
  items: Action<any>[];
  rowIndex: number;
  rowData: any;
}) => {
  return (
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
            return <DropdownMenuSeparator key={`sep-${i}`} />;
          }
          return (
            <DropdownMenuItem
              key={`action-${i}`}
              disabled={action.isDisabled}
              onSelect={(event) => {
                action.onClick?.(event, rowIndex, rowData);
              }}
            >
              {action.title as ReactNode}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function DataTable<T>({
  columns,
  rows,
  actions,
  actionResolver,
  ariaLabelKey,
  selected,
  onSelect,
  onCollapse,
  canSelectAll,
  canSelect,
  isNotCompact,
  isRadio,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState<T[]>(selected || []);
  const [expandedRows, setExpandedRows] = useState<boolean[]>([]);

  const dataRows = useMemo(
    () => (onCollapse ? rows.filter((_, idx) => idx % 2 === 0) : (rows as any[])),
    [rows, onCollapse],
  );

  const rowsSelectedOnPage = useMemo(() => {
    const ids = new Set(dataRows.map((r) => get(r.data, "id")));
    return selectedRows.filter((v) => ids.has(get(v, "id")));
  }, [selectedRows, dataRows]);

  const updateSelectedRows = (next: T[]) => {
    setSelectedRows(next);
    onSelect?.(next);
  };

  const isRowSelected = (row: any) =>
    !!selectedRows.find((v) => get(v, "id") === get(row.data, "id"));

  const toggleRow = (row: any, checked: boolean) => {
    if (isRadio) {
      updateSelectedRows(checked ? [row.data] : []);
      return;
    }
    if (checked) {
      updateSelectedRows([...selectedRows, row.data]);
    } else {
      updateSelectedRows(
        selectedRows.filter((v) => get(v, "id") !== get(row.data, "id")),
      );
    }
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const ids = new Set(selectedRows.map((v) => get(v, "id")));
      const next = [...selectedRows];
      for (const r of dataRows) {
        if (!ids.has(get(r.data, "id"))) next.push(r.data);
      }
      updateSelectedRows(next);
    } else {
      const ids = new Set(dataRows.map((r) => get(r.data, "id")));
      updateSelectedRows(
        selectedRows.filter((v) => !ids.has(get(v, "id"))),
      );
    }
  };

  const allChecked =
    dataRows.length > 0 && rowsSelectedOnPage.length === dataRows.length;
  const someChecked =
    rowsSelectedOnPage.length > 0 &&
    rowsSelectedOnPage.length < dataRows.length;

  const colCount =
    columns.length +
    (canSelect ? 1 : 0) +
    (onCollapse ? 1 : 0) +
    (actions || actionResolver ? 1 : 0);

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <Table aria-label={t(ariaLabelKey)} className={isNotCompact ? "" : "text-sm"}>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {onCollapse && <TableHead className="w-8" aria-hidden="true" />}
            {canSelectAll && (
              <TableHead className="w-10">
                {!isRadio && (
                  <Checkbox
                    aria-label={t("selectAll")}
                    checked={
                      allChecked
                        ? true
                        : someChecked
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(value) => toggleAll(!!value)}
                  />
                )}
              </TableHead>
            )}
            {canSelect && !canSelectAll && <TableHead className="w-10" />}
            {columns.map((column) => (
              <TableHead key={column.displayKey || column.name}>
                {t(column.displayKey || column.name)}
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
            ? (rows as any[]).map((row, index) => {
                const items =
                  actions || actionResolver?.(row, { rowIndex: index }) || [];
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
                          onCheckedChange={(value) =>
                            toggleRow(row, !!value)
                          }
                        />
                      </TableCell>
                    )}
                    {row.cells!.map((c: any, i: number) => (
                      <TableCell key={`cell-${i}`}>
                        {renderCellContent(c)}
                      </TableCell>
                    ))}
                    {(actions || actionResolver) && (
                      <TableCell className="text-end">
                        {items.length > 0 && !row.disableActions && (
                          <RowActionsMenu
                            items={items as Action<T>[]}
                            rowIndex={index}
                            rowData={row}
                          />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            : (rows as any[]).map((row, index) => {
                if (index % 2 !== 0) return null;
                const next = rows[index + 1] as any;
                const isExpandable = !!next && next.cells.length > 0;
                const expanded = expandedRows[index] ?? false;
                const items =
                  actions || actionResolver?.(row, { rowIndex: index }) || [];
                return (
                  <Fragment key={index}>
                    <TableRow
                      data-state={isRowSelected(row) ? "selected" : undefined}
                    >
                      <TableCell className="w-8">
                        {isExpandable && (
                          <Button
                            aria-label={expanded ? t("collapseRow") : t("expandRow")}
                            className="size-6 p-0"
                            onClick={() => {
                              const open = !expanded;
                              onCollapse(open, index);
                              const updated = [...expandedRows];
                              updated[index] = open;
                              setExpandedRows(updated);
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
                      {row.cells!.map((c: any, i: number) => (
                        <TableCell key={`cell-${i}`}>
                          {renderCellContent(c)}
                        </TableCell>
                      ))}
                      {(actions || actionResolver) && (
                        <TableCell className="text-end">
                          {items.length > 0 && !row.disableActions && (
                            <RowActionsMenu
                              items={items as Action<T>[]}
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
                          {next.cells.map((c: any, i: number) => (
                            <div key={`sub-${i}`}>{renderCellContent(c)}</div>
                          ))}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * A generic component that can be used to show the initial list most sections have. Takes care of the loading of the date and filtering.
 * All you have to define is how the columns are displayed.
 * @example
 *   <KeycloakDataTable columns={[
 *     {
 *        name: "clientId",
 *        displayKey: "clientId",
 *        cellRenderer: ClientDetailLink,
 *     }
 *   ]}
 */
export function KeycloakDataTable<T>({
  ariaLabelKey,
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
  icon,
  isSearching = false,
  ...props
}: DataListProps<T>) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<T[]>([]);
  const [rows, setRows] = useState<(Row<T> | SubRow<T>)[]>();
  const [unPaginatedData, setUnPaginatedData] = useState<T[]>();
  const [loading, setLoading] = useState(false);

  const [defaultPageSize, setDefaultPageSize] = useStoredState(
    localStorage,
    "pageSize",
    10,
  );

  const [max, setMax] = useState(defaultPageSize);
  const [first, setFirst] = useState(0);
  const [search, setSearch] = useState<string>("");
  const prevSearch = useRef<string>();

  const [key, setKey] = useState(0);
  const prevKey = useRef<number>();
  const refresh = () => setKey(key + 1);
  const id = useId();

  const renderCell = (cols: (Field<T> | DetailField<T>)[], value: T) => {
    return cols.map((col) => {
      if ("cellFormatters" in col && col.cellFormatters) {
        const v = get(value, col.name);
        return col.cellFormatters.reduce((s: any, f: any) => f(s), v);
      }
      if (col.cellRenderer) {
        const Component = col.cellRenderer as any;
        return { title: <Component {...(value as any)} /> };
      }
      return get(value, col.name);
    });
  };

  const convertToColumns = (data: T[]): (Row<T> | SubRow<T>)[] => {
    const isDetailColumnsEnabled = (value: T) =>
      detailColumns?.[0]?.enabled?.(value);
    return data
      .map((value, index) => {
        const disabledRow = isRowDisabled ? isRowDisabled(value) : false;
        const row: (Row<T> | SubRow<T>)[] = [
          {
            data: value,
            disableSelection: disabledRow,
            disableActions: disabledRow,
            selected: !!selected.find(
              (v) => get(v, "id") === get(value, "id"),
            ),
            isOpen: isDetailColumnsEnabled(value) ? false : undefined,
            cells: renderCell(columns, value),
          },
        ];
        if (detailColumns) {
          row.push({
            parent: index * 2,
            cells: isDetailColumnsEnabled(value)
              ? renderCell(detailColumns!, value)
              : [],
          } as SubRow<T>);
        }
        return row;
      })
      .flat();
  };

  const getNodeText = (node: Cell<T>): string => {
    if (["string", "number"].includes(typeof node)) {
      return node!.toString();
    }
    if (node instanceof Array) {
      return node.map(getNodeText).join("");
    }
    if (typeof node === "object") {
      return getNodeText(
        isValidElement((node as TitleCell).title)
          ? (node as TitleCell).title.props
          : Object.values(node as any),
      );
    }
    return "";
  };

  const filteredData = useMemo<(Row<T> | SubRow<T>)[] | undefined>(
    () =>
      search === "" || isPaginated
        ? undefined
        : convertToColumns(unPaginatedData || [])
            .filter((row) =>
              row.cells.some(
                (cell) =>
                  cell &&
                  getNodeText(cell)
                    .toLowerCase()
                    .includes(search.toLowerCase()),
              ),
            )
            .slice(first, first + max + 1),
    [search, first, max],
  );

  useFetch(
    async () => {
      setLoading(true);
      const newSearch = prevSearch.current === "" && search !== "";

      if (newSearch) {
        setFirst(0);
      }
      prevSearch.current = search;
      return typeof loader === "function"
        ? key === prevKey.current && unPaginatedData
          ? unPaginatedData
          : await loader(newSearch ? 0 : first, max + 1, search)
        : loader;
    },
    (data) => {
      prevKey.current = key;
      if (!isPaginated) {
        setUnPaginatedData(data);
        if (data.length > first) {
          data = data.slice(first, first + max + 1);
        } else {
          setFirst(0);
        }
      }

      const result = convertToColumns(data);
      setRows(result);
      setLoading(false);
    },
    [
      key,
      first,
      max,
      search,
      typeof loader !== "function" ? loader : undefined,
    ],
  );

  const convertAction = () =>
    actions &&
    cloneDeep(actions).map((action: Action<T>, index: number) => {
      delete action.onRowClick;
      action.onClick = async (_: any, rowIndex: number) => {
        const result = await actions[index].onRowClick!(
          (filteredData || rows)![rowIndex].data,
        );
        if (result) {
          if (!isPaginated) {
            setSearch("");
          }
          refresh();
        }
      };
      return action;
    });

  const onCollapse = (isOpen: boolean, rowIndex: number) => {
    (data![rowIndex] as Row<T>).isOpen = isOpen;
    setRows([...data!]);
  };

  const data = filteredData || rows;
  const noData = !data || data.length === 0;
  const searching = search !== "" || isSearching;
  const maxRows = detailColumns ? max * 2 : max;
  const rowLength = detailColumns
    ? (data?.length || 0) / 2
    : data?.length || 0;

  return (
    <>
      {(!noData || searching) && (
        <PaginatingTableToolbar
          id={id}
          count={rowLength}
          first={first}
          max={max}
          onNextClick={setFirst}
          onPreviousClick={setFirst}
          onPerPageSelect={(first, max) => {
            setFirst(first);
            setMax(max);
            setDefaultPageSize(max);
          }}
          inputGroupName={
            searchPlaceholderKey ? `${ariaLabelKey}input` : undefined
          }
          inputGroupOnEnter={setSearch}
          inputGroupPlaceholder={t(searchPlaceholderKey || "")}
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
                <SyncAltIcon aria-hidden="true" size={14} /> {t("refresh")}
              </Button>
            </>
          }
          subToolbar={subToolbar}
        >
          {!loading && !noData && (
            <DataTable
              {...props}
              canSelectAll={canSelectAll}
              canSelect={!!onSelect}
              selected={selected}
              onSelect={(selected) => {
                setSelected(selected);
                onSelect?.(selected);
              }}
              onCollapse={detailColumns ? onCollapse : undefined}
              actions={convertAction()}
              actionResolver={actionResolver}
              rows={data.slice(0, maxRows)}
              columns={columns}
              isNotCompact={isNotCompact}
              isRadio={isRadio}
              ariaLabelKey={ariaLabelKey}
            />
          )}
          {!loading && noData && searching && (
            <ListEmptyState
              hasIcon={true}
              icon={icon}
              isSearchVariant={true}
              message={t("noSearchResults")}
              instructions={t("noSearchResultsInstructions")}
              secondaryActions={
                !isSearching
                  ? [
                      {
                        text: t("clearAllFilters"),
                        onClick: () => setSearch(""),
                      },
                    ]
                  : []
              }
            />
          )}
        </PaginatingTableToolbar>
      )}
      {loading && <KeycloakSpinner />}
      {!loading && noData && !searching && emptyState}
    </>
  );
}
