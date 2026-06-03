/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/client-scopes/details/MapperList.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Path } from "react-router-dom";
import { Link } from "react-router-dom";

import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type ClientScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientScopeRepresentation";
import type ProtocolMapperRepresentation from "@keycloak/keycloak-admin-client/lib/defs/protocolMapperRepresentation";
import type { ProtocolMapperTypeRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/serverInfoRepesentation";
import { useServerInfo } from "../../../context/server-info/server-info-provider";

import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { AddMapperDialog } from "../add/mapper-dialog";
import { Action, DataTable } from "@metronome/ui/components/table/data-table";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";

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
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";

type MapperListProps = {
  model: ClientScopeRepresentation | ClientRepresentation;
  onAdd: (
    mappers: ProtocolMapperTypeRepresentation | ProtocolMapperRepresentation[],
  ) => void;
  onDelete: (mapper: ProtocolMapperRepresentation) => void;
  detailLink: (id: string) => Partial<Path>;
};

type Row = ProtocolMapperRepresentation & {
  category: string;
  type: string;
  priority: number;
};

type MapperLinkProps = Row & {
  detailLink: (id: string) => Partial<Path>;
};

const MapperLink = ({ id, name, detailLink }: MapperLinkProps) => (
  <Link to={detailLink(id!)}>{name}</Link>
);

export const MapperList = ({
  model,
  onAdd,
  onDelete,
  detailLink,
}: MapperListProps) => {
  const { t } = useTranslation();

  const [mapperAction, setMapperAction] = useState(false);
  const mapperList = model.protocolMappers;
  const mapperTypes = useServerInfo().protocolMapperTypes![model.protocol!];

  const [key, setKey] = useState(0);
  useEffect(() => setKey(key + 1), [mapperList]);

  const [addMapperDialogOpen, setAddMapperDialogOpen] = useState(false);
  const [filter, setFilter] = useState(model.protocolMappers);
  const toggleAddMapperDialog = (buildIn: boolean) => {
    if (buildIn) {
      setFilter(mapperList || []);
    } else {
      setFilter(undefined);
    }
    setAddMapperDialogOpen(!addMapperDialogOpen);
  };

  const loader = async () => {
    if (!mapperList) {
      return [];
    }

    const list = mapperList.reduce<Row[]>((rows, mapper) => {
      const mapperType = mapperTypes.find(
        ({ id }) => id === mapper.protocolMapper,
      );

      if (!mapperType) {
        return rows;
      }

      return rows.concat({
        ...mapper,
        category: mapperType.category,
        type: mapperType.name,
        priority: mapperType.priority,
      });
    }, []);

    return list.sort((a, b) => a.priority - b.priority);
  };

  return (
    <>
      <AddMapperDialog
        protocol={model.protocol!}
        filter={filter}
        onConfirm={onAdd}
        open={addMapperDialogOpen}
        toggleDialog={() => setAddMapperDialogOpen(!addMapperDialogOpen)}
      />

      <DataTable
        t={t}
        key={key}
        loader={loader}
        ariaLabelKey="clientScopeList"
        searchPlaceholderKey="searchForMapper"
        toolbarItem={
          <Dropdown
            onSelect={() => setMapperAction(false)}
            onOpenChange={(isOpen) => setMapperAction(isOpen)}
            toggle={(ref) => (
              <MenuToggle
                ref={ref}
                variant="primary"
                id="mapperAction"
                onClick={() => setMapperAction(!mapperAction)}
              >
                {t("addMapper")}
              </MenuToggle>
            )}
            isOpen={mapperAction}
          >
            <DropdownList>
              <DropdownItem onClick={() => toggleAddMapperDialog(true)}>
                {t("fromPredefinedMapper")}
              </DropdownItem>
              <DropdownItem onClick={() => toggleAddMapperDialog(false)}>
                {t("byConfiguration")}
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        }
        actions={[
          {
            title: t("delete"),
            onRowClick: onDelete,
          } as Action<Row>,
        ]}
        columns={[
          {
            name: "name",
            cellRenderer: (row) => (
              <MapperLink {...row} detailLink={detailLink} />
            ),
          },
          { name: "category" },
          {
            name: "type",
          },
          {
            name: "priority",
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyMappers")}
            instructions={t("emptyMappersInstructions")}
            secondaryActions={[
              {
                text: t("emptyPrimaryAction"),
                onClick: () => toggleAddMapperDialog(true),
              },
              {
                text: t("emptySecondaryAction"),
                onClick: () => toggleAddMapperDialog(false),
              },
            ]}
          />
        }
      />
    </>
  );
};
