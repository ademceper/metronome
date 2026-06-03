/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/components/GroupTree.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { cn } from "@metronome/ui/lib/utils";
import { useAlerts, useFetch } from "../../../../shared/keycloak-ui-shared";
import { PaginatingTableToolbar } from "@metronome/ui/components/table-toolbar";
import { CaretRight as AngleRightIcon, DotsThreeVertical as EllipsisVIcon } from "@phosphor-icons/react"
import { useGroupResource } from "../../../context/group-resource/group-resource-context";
import { unionBy } from "lodash-es";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { KeycloakSpinner } from "../../../../shared/keycloak-ui-shared";
import { useAccess } from "../../../context/access/access";
import { fetchAdminUI } from "../../../context/auth/admin-ui-endpoint";
import { useRealm } from "../../../context/realm-context/realm-context";
import useToggle from "../../../utils/use-toggle";
import { GroupsModal } from "../GroupsModal";
import { useSubGroups } from "../SubGroupsContext";
import { toGroups } from "../../../lib/groups";
import { DeleteGroup } from "./DeleteGroup";
import { MoveDialog } from "./MoveDialog";

const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
const Checkbox = ({ id, label, description, isChecked, isDisabled, onChange, name, ...props }: any) => (
  <div className="flex items-start gap-2">
    <UICheckbox id={id} name={name} checked={isChecked} disabled={isDisabled}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);
const Divider = (props: any) => <UISeparator {...props} />;
const Dropdown = ({ toggle, isOpen, onSelect, onOpenChange, popperProps, children, ...props }: any) => {
  const trigger = typeof toggle === "function" ? toggle((node: HTMLElement | null) => node) : toggle;
  return (
    <UIDropdownMenu open={isOpen} onOpenChange={(open: boolean) => onOpenChange?.(open)}>
      <UIDropdownMenuTrigger asChild>{trigger}</UIDropdownMenuTrigger>
      <UIDropdownMenuContent>{children}</UIDropdownMenuContent>
    </UIDropdownMenu>
  );
};
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const DropdownList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;
const Tooltip = ({ content, children, ...props }: any) => <>{children}</>;
const TreeView = ({ data, onSelect, activeItems, hasGuides, ...props }: any) => {
  const renderItem = (item: any) => (
    <li key={item.id ?? item.name} className="text-sm">
      <button type="button" onClick={(e) => onSelect?.(e, item)} className="rounded-md px-2 py-1 text-left hover:bg-muted">
        {item.title ?? item.name}
      </button>
      {item.children?.length ? <ul className="ml-3">{item.children.map(renderItem)}</ul> : null}
    </li>
  );
  return <ul className="flex flex-col gap-1" {...props}>{Array.isArray(data) ? data.map(renderItem) : null}</ul>;
};
type TreeViewDataItem = {
  id?: string;
  name?: string | React.ReactNode;
  title?: string | React.ReactNode;
  children?: TreeViewDataItem[];
  [key: string]: any;
};

type ExtendedTreeViewDataItem = TreeViewDataItem & {
  access?: Record<string, boolean>;
};

type GroupTreeContextMenuProps = {
  group: GroupRepresentation;
  refresh: () => void;
};

export function countGroups(groups: GroupRepresentation[]) {
  let count = groups.length;
  for (const group of groups) {
    if (group.subGroups) {
      count += countGroups(group.subGroups);
    }
  }
  return count;
}

const GroupTreeContextMenu = ({
  group,
  refresh,
}: GroupTreeContextMenuProps) => {
  const { t } = useTranslation();

  const [isOpen, toggleOpen] = useToggle();
  const [renameOpen, toggleRenameOpen] = useToggle();
  const [createOpen, toggleCreateOpen] = useToggle();
  const [moveOpen, toggleMoveOpen] = useToggle();
  const [deleteOpen, toggleDeleteOpen] = useToggle();
  const navigate = useNavigate();
  const { realm } = useRealm();
  const orgId = useGroupResource().getOrgId();

  return (
    <>
      {renameOpen && (
        <GroupsModal
          id={group.id}
          rename={group}
          refresh={() => {
            navigate(toGroups({ realm, orgId }));
            refresh();
          }}
          handleModalToggle={toggleRenameOpen}
        />
      )}
      {createOpen && (
        <GroupsModal
          id={group.id}
          handleModalToggle={toggleCreateOpen}
          refresh={refresh}
        />
      )}
      {moveOpen && (
        <MoveDialog source={group} refresh={refresh} onClose={toggleMoveOpen} />
      )}
      <DeleteGroup
        show={deleteOpen}
        toggleDialog={toggleDeleteOpen}
        selectedRows={[group]}
        refresh={() => {
          navigate(toGroups({ realm, orgId }));
          refresh();
        }}
      />
      <Dropdown
        popperProps={{
          position: "right",
        }}
        onOpenChange={toggleOpen}
        toggle={(ref) => (
          <MenuToggle
            ref={ref}
            onClick={toggleOpen}
            isExpanded={isOpen}
            variant="plain"
            aria-label="Actions"
          >
            <EllipsisVIcon />
          </MenuToggle>
        )}
        isOpen={isOpen}
      >
        <DropdownList>
          <DropdownItem key="rename" onClick={toggleRenameOpen}>
            {t("edit")}
          </DropdownItem>
          <DropdownItem key="move" onClick={toggleMoveOpen}>
            {t("moveTo")}
          </DropdownItem>
          <DropdownItem key="create" onClick={toggleCreateOpen}>
            {t("createChildGroup")}
          </DropdownItem>
          <Divider key="separator" />
          <DropdownItem key="delete" onClick={toggleDeleteOpen}>
            {t("delete")}
          </DropdownItem>
        </DropdownList>
      </Dropdown>
    </>
  );
};

type GroupTreeProps = {
  refresh: () => void;
  canViewDetails: boolean;
};

const SUBGROUP_COUNT = 50;

const TreeLoading = () => {
  const { t } = useTranslation();
  return (
    <>
      <Spinner size="sm" /> {t("spinnerLoading")}
    </>
  );
};

const LOADING_TREE = [
  {
    name: <TreeLoading />,
  },
];

export const GroupTree = ({
  refresh: viewRefresh,
  canViewDetails,
}: GroupTreeProps) => {
  const { adminClient } = useAdminClient();
  const isOrgGroups = useGroupResource().isOrgGroups();
  const orgId = useGroupResource().getOrgId();

  const { t } = useTranslation();
  const { realm } = useRealm();
  const navigate = useNavigate();
  const { addAlert } = useAlerts();
  const { hasAccess } = useAccess();

  const [data, setData] = useState<ExtendedTreeViewDataItem[]>();
  const { subGroups, clear } = useSubGroups();

  const [search, setSearch] = useState("");
  const [max, setMax] = useState(20);
  const [first, setFirst] = useState(0);
  const prefFirst = useRef(0);
  const prefMax = useRef(20);
  const prefSearch = useRef("");
  const [count, setCount] = useState(0);
  const [exact, setExact] = useState(false);
  const [activeItem, setActiveItem] = useState<ExtendedTreeViewDataItem>();

  const [firstSub, setFirstSub] = useState(0);

  const [key, setKey] = useState(0);
  const refresh = () => {
    setKey(key + 1);
    viewRefresh();
  };

  const mapGroup = (
    group: GroupRepresentation,
    refresh: () => void,
  ): ExtendedTreeViewDataItem => {
    const hasSubGroups = group.subGroupCount;
    return {
      id: group.id,
      name: (
        <Tooltip content={group.name}>
          <span>{group.name}</span>
        </Tooltip>
      ),
      access: group.access || {},
      children: hasSubGroups
        ? search.length === 0
          ? LOADING_TREE
          : group.subGroups?.map((g) => mapGroup(g, refresh))
        : undefined,
      action: (hasAccess("manage-users") || group.access?.manage) && (
        <GroupTreeContextMenu group={group} refresh={refresh} />
      ),
      defaultExpanded: subGroups.map((g) => g.id).includes(group.id),
    };
  };

  useFetch(
    async () => {
      const groupsEndpoint = isOrgGroups
        ? `organizations/${orgId}/groups`
        : "groups";
      const groups = await fetchAdminUI<GroupRepresentation[]>(
        adminClient,
        groupsEndpoint,
        Object.assign(
          {
            first: `${first}`,
            max: `${max + 1}`,
            exact: `${exact}`,
            global: `${search !== ""}`,
            ...(isOrgGroups
              ? {
                  subGroupsCount: "true",
                  ...(search && { populateHierarchy: "true" }),
                }
              : {}),
          },
          search === "" ? null : { search },
        ),
      );
      let subGroups: GroupRepresentation[] = [];
      if (activeItem) {
        subGroups = await fetchAdminUI<GroupRepresentation[]>(
          adminClient,
          `${groupsEndpoint}/${activeItem.id}/children`,
          {
            first: `${firstSub}`,
            max: `${SUBGROUP_COUNT}`,
            ...(isOrgGroups ? { subGroupsCount: "true" } : {}),
          },
        );
      }
      return { groups, subGroups };
    },
    ({ groups, subGroups }) => {
      if (activeItem) {
        const found = findGroup(data || [], activeItem.id!, []);
        if (found.length && subGroups.length) {
          const foundTreeItem = found.pop()!;
          foundTreeItem.children = [
            ...(unionBy(foundTreeItem.children || []).splice(0, SUBGROUP_COUNT),
            subGroups.map((g) => mapGroup(g, refresh), "id")),
            ...(subGroups.length === SUBGROUP_COUNT
              ? [
                  {
                    id: "next",
                    name: (
                      <Button
                        variant="plain"
                        onClick={() => setFirstSub(firstSub + SUBGROUP_COUNT)}
                      >
                        <AngleRightIcon />
                      </Button>
                    ),
                  },
                ]
              : []),
          ];
        }
      }
      if (
        search ||
        prefSearch.current !== search ||
        prefFirst.current !== first ||
        prefMax.current !== max
      ) {
        setData(groups.map((g) => mapGroup(g, refresh)));
      } else {
        setData(
          unionBy(
            data,
            groups.map((g) => mapGroup(g, refresh)),
            "id",
          ),
        );
      }
      setCount(countGroups(groups));
      prefFirst.current = first;
      prefMax.current = max;
      prefSearch.current = search;
    },
    [key, first, firstSub, max, search, exact, activeItem],
  );

  const findGroup = (
    groups: ExtendedTreeViewDataItem[],
    id: string,
    path: ExtendedTreeViewDataItem[],
  ) => {
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index];
      if (group.id === id) {
        path.push(group);
        return path;
      }

      if (group.children) {
        path.push(group);
        findGroup(group.children, id, path);
        if (path[path.length - 1].id !== id) {
          path.pop();
        }
      }
    }
    return path;
  };

  const nav = (item: TreeViewDataItem, data: ExtendedTreeViewDataItem[]) => {
    if (item.id === "next") return;
    setActiveItem(item);

    const path = findGroup(data, item.id!, []);
    if (!subGroups.every(({ id }) => path.find((t) => t.id === id))) clear();
    if (
      canViewDetails ||
      path.at(-1)?.access?.view ||
      subGroups.at(-1)?.access?.view
    ) {
      navigate(
        toGroups({
          realm,
          id: path.map((g) => g.id).join("/"),
          orgId,
        }),
      );
    } else {
      addAlert(t("noViewRights"), AlertVariant.warning);
      navigate(toGroups({ realm, orgId }));
    }
  };

  return data ? (
    <PaginatingTableToolbar
      count={count}
      first={first}
      max={max}
      onNextClick={setFirst}
      onPreviousClick={setFirst}
      onPerPageSelect={(first, max) => {
        setFirst(first);
        setMax(max);
      }}
      inputGroupName="searchForGroups"
      inputGroupPlaceholder={t("searchForGroups")}
      inputGroupOnEnter={setSearch}
      toolbarItem={
        <InputGroup className="pf-v5-u-pt-sm">
          <InputGroupItem>
            <Checkbox
              id="exact"
              data-testid="exact-search"
              name="exact"
              isChecked={exact}
              onChange={(_event, value) => setExact(value)}
              className="pf-v5-u-mr-xs"
            />
          </InputGroupItem>
          <InputGroupItem>
            <label htmlFor="exact" className="pf-v5-u-pl-sm">
              {t("exactSearch")}
            </label>
          </InputGroupItem>
        </InputGroup>
      }
    >
      {data.length > 0 && (
        <TreeView
          data={data.slice(0, max)}
          allExpanded={search.length > 0}
          activeItems={activeItem ? [activeItem] : undefined}
          hasGuides
          hasSelectableNodes
          className="keycloak_groups_treeview"
          onExpand={(_, item) => {
            nav(item, data);
          }}
          onSelect={(_, item) => {
            nav(item, data);
          }}
        />
      )}
    </PaginatingTableToolbar>
  ) : (
    <KeycloakSpinner />
  );
};
