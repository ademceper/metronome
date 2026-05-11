/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/client-scopes/add/MapperDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import type ProtocolMapperRepresentation from "@keycloak/keycloak-admin-client/lib/defs/protocolMapperRepresentation";
import type { ProtocolMapperTypeRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/serverInfoRepesentation";

import { useServerInfo } from "../../context/server-info/ServerInfoProvider";
import { ListEmptyState } from "../../../shared/keycloak-ui-shared";
import { KeycloakDataTable } from "../../../shared/keycloak-ui-shared";
import useLocaleSort, { mapByKey } from "../../utils/useLocaleSort";


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
const DataList = ({ children, className, ...props }: any) => (
  <div className={cn("divide-y rounded-md border", className)} {...props}>{children}</div>
);
const DataListCell = ({ children, className, ...props }: any) => (
  <div className={cn("flex-1", className)} {...props}>{children}</div>
);
const DataListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const DataListItemCells = ({ dataListCells, ...props }: any) => (
  <div className="flex flex-1 items-center gap-2" {...props}>{dataListCells}</div>
);
const DataListItemRow = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 px-3 py-2", className)} {...props}>{children}</div>
);
const Modal = ({ isOpen, onClose, title, description, variant, actions, header, footer, children, ...props }: any) => (
  <UIDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
    <UIDialogContent {...props}>
      {(title || header) ? (
        <UIDialogHeader>
          {title ? <UIDialogTitle>{title}</UIDialogTitle> : null}
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          {header}
        </UIDialogHeader>
      ) : null}
      {children}
      {(actions || footer) ? (
        <UIDialogFooter>
          {actions}
          {footer}
        </UIDialogFooter>
      ) : null}
    </UIDialogContent>
  </UIDialog>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;

type Row = {
  id: string;
  description: string;
  item: ProtocolMapperRepresentation;
};

export type AddMapperDialogModalProps = {
  protocol: string;
  filter?: ProtocolMapperRepresentation[];
  onConfirm: (
    value: ProtocolMapperTypeRepresentation | ProtocolMapperRepresentation[],
  ) => void;
};

export type AddMapperDialogProps = AddMapperDialogModalProps & {
  open: boolean;
  toggleDialog: () => void;
};

export const AddMapperDialog = (props: AddMapperDialogProps) => {
  const { t } = useTranslation();

  const serverInfo = useServerInfo();
  const protocol = props.protocol;
  const protocolMappers = serverInfo.protocolMapperTypes![protocol];
  const builtInMappers = serverInfo.builtinProtocolMappers![protocol];
  const [filter, setFilter] = useState<ProtocolMapperRepresentation[]>([]);
  const [selectedRows, setSelectedRows] = useState<Row[]>([]);
  const localeSort = useLocaleSort();

  const allRows = useMemo(
    () =>
      localeSort(builtInMappers, mapByKey("name")).map((mapper) => {
        const mapperType = protocolMappers.find(
          (type) => type.id === mapper.protocolMapper,
        )!;
        return {
          item: mapper,
          id: mapper.name!,
          description: mapperType.helpText,
        };
      }),
    [builtInMappers, protocolMappers],
  );
  const [rows, setRows] = useState(allRows);

  if (props.filter && props.filter.length !== filter.length) {
    setFilter(props.filter);
    const nameFilter = props.filter.map((f) => f.name);
    setRows([...allRows.filter((row) => !nameFilter.includes(row.item.name))]);
  }

  const sortedProtocolMappers = useMemo(
    () => localeSort(protocolMappers, mapByKey("name")),
    [protocolMappers],
  );

  const isBuiltIn = !!props.filter;

  const header = [t("name"), t("description")];

  return (
    <Modal
      aria-label={
        isBuiltIn ? t("addPredefinedMappers") : t("emptySecondaryAction")
      }
      variant={ModalVariant.medium}
      header={
        <TextContent
          role="dialog"
          aria-label={
            isBuiltIn ? t("addPredefinedMappers") : t("emptySecondaryAction")
          }
        >
          <Text component={TextVariants.h1}>
            {isBuiltIn ? t("addPredefinedMappers") : t("emptySecondaryAction")}
          </Text>
          <Text>
            {isBuiltIn
              ? t("predefinedMappingDescription")
              : t("configureMappingDescription")}
          </Text>
        </TextContent>
      }
      isOpen={props.open}
      onClose={props.toggleDialog}
      actions={
        isBuiltIn
          ? [
              <Button
                id="modal-confirm"
                data-testid="confirm"
                key="confirm"
                isDisabled={rows.length === 0 || selectedRows.length === 0}
                onClick={() => {
                  props.onConfirm(selectedRows.map(({ item }) => item));
                  props.toggleDialog();
                }}
              >
                {t("add")}
              </Button>,
              <Button
                id="modal-cancel"
                data-testid="cancel"
                key="cancel"
                variant={ButtonVariant.link}
                onClick={() => {
                  props.toggleDialog();
                }}
              >
                {t("cancel")}
              </Button>,
            ]
          : []
      }
    >
      {!isBuiltIn && (
        <DataList
          onSelectDataListItem={(_event, id) => {
            const mapper = protocolMappers.find((mapper) => mapper.id === id);
            props.onConfirm(mapper!);
            props.toggleDialog();
          }}
          aria-label={t("addPredefinedMappers")}
          isCompact
        >
          <DataListItem aria-label={t("headerName")} id="header">
            <DataListItemRow>
              <DataListItemCells
                dataListCells={header.map((name) => (
                  <DataListCell style={{ fontWeight: 700 }} key={name}>
                    {name}
                  </DataListCell>
                ))}
              />
            </DataListItemRow>
          </DataListItem>
          {sortedProtocolMappers.map((mapper) => (
            <DataListItem
              aria-label={mapper.name}
              key={mapper.id}
              id={mapper.id}
            >
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key={`name-${mapper.id}`}>
                      {mapper.name}
                    </DataListCell>,
                    <DataListCell key={`helpText-${mapper.id}`}>
                      {mapper.helpText}
                    </DataListCell>,
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
      )}
      {isBuiltIn && (
        <KeycloakDataTable
          loader={rows}
          onSelect={setSelectedRows}
          canSelectAll
          ariaLabelKey="addPredefinedMappers"
          searchPlaceholderKey="searchForMapper"
          columns={[
            {
              name: "id",
              displayKey: "name",
            },
            {
              name: "description",
              displayKey: "description",
            },
          ]}
          emptyState={
            <ListEmptyState
              message={t("emptyMappers")}
              instructions={t("emptyBuiltInMappersInstructions")}
            />
          }
        />
      )}
    </Modal>
  );
};
