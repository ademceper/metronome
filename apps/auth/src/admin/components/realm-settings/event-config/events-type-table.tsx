/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/event-config/EventsTypeTable.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Action, DataTable } from "@metronome/ui/components/table/data-table";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { translationFormatter } from "../../../utils/translation-formatter";


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
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

export type EventType = {
  id: string;
};

type EventsTypeTableProps = {
  ariaLabelKey?: string;
  eventTypes: string[];
  addTypes?: () => void;
  onSelect?: (value: EventType[]) => void;
  onDelete?: (value: EventType) => void;
  onDeleteAll?: (value: EventType[]) => void;
};

export function EventsTypeTable({
  ariaLabelKey = "userEventsRegistered",
  eventTypes,
  addTypes,
  onSelect,
  onDelete,
  onDeleteAll,
}: EventsTypeTableProps) {
  const { t } = useTranslation();
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);

  const data = eventTypes.map((type) => ({
    id: type,
    name: t(`eventTypes.${type}.name`),
    description: t(`eventTypes.${type}.description`),
  }));
  return (
    <DataTable
      t={t}
      ariaLabelKey={ariaLabelKey}
      searchPlaceholderKey="searchEventType"
      loader={data}
      onSelect={onSelect ? onSelect : setSelectedTypes}
      canSelectAll
      toolbarItem={
        <>
          {addTypes && (
            <ToolbarItem>
              <Button id="addTypes" onClick={addTypes} data-testid="addTypes">
                {t("addSavedTypes")}
              </Button>
            </ToolbarItem>
          )}
          {onDeleteAll && (
            <ToolbarItem>
              <Button
                onClick={() => onDeleteAll(selectedTypes)}
                data-testid="removeAll"
                variant="secondary"
                isDisabled={selectedTypes.length === 0}
              >
                {t("remove")}
              </Button>
            </ToolbarItem>
          )}
        </>
      }
      actions={
        !onDelete
          ? []
          : [
              {
                title: t("remove"),
                onRowClick: onDelete,
              } as Action<EventType>,
            ]
      }
      columns={[
        {
          name: "name",
          displayKey: "eventType",
        },
        {
          name: "description",
          cellFormatters: [translationFormatter(t)],
        },
      ]}
      emptyState={
        <ListEmptyState
          message={t("emptyEvents")}
          instructions={t("emptyEventsInstructions")}
        />
      }
    />
  );
}
