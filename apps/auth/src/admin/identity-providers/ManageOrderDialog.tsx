/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/ManageOrderDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import {
  KeycloakSpinner,
  useAlerts,
  useFetch,
} from "../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { sortBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";


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
const DataListControl = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);
const DataListDragButton = (props: any) => (
  <button type="button" aria-label="drag" className="cursor-grab text-muted-foreground text-sm" {...props}>⋮⋮</button>
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
const DragDrop = ({ onDrag, onDrop, children, ...props }: any) => (
  <div {...props}>{children}</div>
);
const Draggable = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);
const Droppable = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
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
type DraggableItemPosition = any;

type ManageOrderDialogProps = {
  orgId?: string;
  hideRealmBasedIdps?: boolean;
  onClose: () => void;
};

export const ManageOrderDialog = ({
  orgId,
  hideRealmBasedIdps = false,
  onClose,
}: ManageOrderDialogProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const [liveText, setLiveText] = useState("");
  const [providers, setProviders] =
    useState<IdentityProviderRepresentation[]>();
  const [order, setOrder] = useState<string[]>([]);

  const onDragStart = ({ index }: DraggableItemPosition) => {
    setLiveText(t("onDragStart", { item: order[index] }));
    return true;
  };

  const onDragMove = ({ index }: DraggableItemPosition) => {
    setLiveText(t("onDragMove", { item: order[index] }));
  };

  const onDragFinish = (
    source: DraggableItemPosition,
    dest?: DraggableItemPosition,
  ) => {
    if (dest) {
      const result = [...order];
      const [removed] = result.splice(source.index, 1);
      result.splice(dest.index, 0, removed);
      setLiveText(t("onDragFinish", { list: result }));
      setOrder(result);
      return true;
    } else {
      setLiveText(t("onDragCancel"));
      return false;
    }
  };

  useFetch(
    () =>
      orgId
        ? adminClient.organizations.listIdentityProviders({ orgId })
        : adminClient.identityProviders.find({ realmOnly: hideRealmBasedIdps }),
    (providers) => {
      setProviders(providers);
      setOrder(
        sortBy(providers, ["config.guiOrder", "alias"]).map(
          (provider) => provider.alias!,
        ),
      );
    },
    [],
  );

  if (!providers) {
    return <KeycloakSpinner />;
  }

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("manageDisplayOrder")}
      isOpen
      onClose={onClose}
      actions={[
        <Button
          id="modal-confirm"
          data-testid="confirm"
          key="confirm"
          onClick={async () => {
            const updates = order.map((alias, index) => {
              const provider = providers.find((p) => p.alias === alias)!;
              provider.config!.guiOrder = index;
              return adminClient.identityProviders.update({ alias }, provider);
            });

            try {
              await Promise.all(updates);
              addAlert(t("orderChangeSuccess"));
            } catch (error) {
              addError("orderChangeError", error);
            }

            onClose();
          }}
        >
          {t("save")}
        </Button>,
        <Button
          id="modal-cancel"
          data-testid="cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={onClose}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <TextContent className="pf-v5-u-pb-lg">
        <Text>{t("orderDialogIntro")}</Text>
      </TextContent>

      <DragDrop
        onDrag={onDragStart}
        onDragMove={onDragMove}
        onDrop={onDragFinish}
      >
        <Droppable hasNoWrapper>
          <DataList
            aria-label={t("manageOrderTableAria")}
            data-testid="manageOrderDataList"
            isCompact
          >
            {order.map((alias) => (
              <Draggable hasNoWrapper key={alias}>
                <DataListItem aria-label={alias} id={alias}>
                  <DataListItemRow>
                    <DataListControl>
                      <DataListDragButton aria-label={t("dragHelp")} />
                    </DataListControl>
                    <DataListItemCells
                      dataListCells={[
                        <DataListCell key={alias} data-testid={alias}>
                          {alias}
                        </DataListCell>,
                      ]}
                    />
                  </DataListItemRow>
                </DataListItem>
              </Draggable>
            ))}
          </DataList>
        </Droppable>
      </DragDrop>
      <div className="pf-v5-screen-reader" aria-live="assertive">
        {liveText}
      </div>
    </Modal>
  );
};
