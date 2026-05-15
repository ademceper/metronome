/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/MembershipsModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@metronome/ui/components/popover";
import { cn } from "@metronome/ui/lib/utils";
import { Question as QuestionCircleIcon } from "@phosphor-icons/react"
const cellWidth = (_n: number) => () => ({ className: '' });
import { useHelp } from "../../../shared/keycloak-ui-shared";
import { ListEmptyState } from "../../../shared/keycloak-ui-shared";
import { KeycloakDataTable } from "../../../shared/keycloak-ui-shared";
import { sortBy, uniqBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { GroupPath } from "../group/GroupPath";
import { useGroupResource } from "../../context/group-resource/GroupResourceContext";


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
const Popover = ({ bodyContent, headerContent, footerContent, children, position, ...props }: any) => (
  <UIPopover {...props}>
    <UIPopoverTrigger asChild>{children}</UIPopoverTrigger>
    <UIPopoverContent>
      {headerContent ? (
        <div className="font-medium text-sm">{typeof headerContent === "function" ? headerContent() : headerContent}</div>
      ) : null}
      {bodyContent ? (
        <div className="text-sm">{typeof bodyContent === "function" ? bodyContent() : bodyContent}</div>
      ) : null}
      {footerContent ? (
        <div className="pt-2 text-sm">{typeof footerContent === "function" ? footerContent() : footerContent}</div>
      ) : null}
    </UIPopoverContent>
  </UIPopover>
);

type CredentialDataDialogProps = {
  user: UserRepresentation;
  onClose: () => void;
  orgId?: string;
};

export const MembershipsModal = ({
  user,
  onClose,
  orgId,
}: CredentialDataDialogProps) => {
  const { t } = useTranslation();
  const { adminClient } = useAdminClient();
  const groupsResource = useGroupResource();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const [isDirectMembership, setDirectMembership] = useState(true);
  const { enabled } = useHelp();
  const alphabetize = (groupsList: GroupRepresentation[]) => {
    return sortBy(groupsList, (group) => group.path?.toUpperCase());
  };

  const loader = async (first?: number, max?: number, search?: string) => {
    const params: { [name: string]: string | number } = {
      first: first!,
      max: max!,
    };

    const searchParam = search || "";
    if (searchParam) {
      params.search = searchParam;
    }

    const joinedUserGroups = orgId
      ? await groupsResource.listOrgGroups({
          ...params,
          id: user.id!,
        })
      : await adminClient.users.listGroups({
          ...params,
          id: user.id!,
        });

    const indirect: GroupRepresentation[] = [];
    if (!isDirectMembership)
      joinedUserGroups.forEach((g) => {
        const paths = (
          g.path?.substring(1).match(/((~\/)|[^/])+/g) || []
        ).slice(0, -1);

        indirect.push(
          ...paths.map((p) => ({
            name: p,
            path: g.path?.substring(0, g.path.indexOf(p) + p.length),
          })),
        );
      });

    return alphabetize(uniqBy([...joinedUserGroups, ...indirect], "path"));
  };

  return (
    <Modal
      variant={ModalVariant.large}
      title={t("showMembershipsTitle", { username: user.username })}
      data-testid="showMembershipsDialog"
      isOpen
      onClose={onClose}
      actions={[
        <Button
          id="modal-cancel"
          data-testid="cancel"
          key="cancel"
          variant={ButtonVariant.primary}
          onClick={onClose}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <KeycloakDataTable
        key={key}
        loader={loader}
        className="keycloak_user-section_groups-table"
        isPaginated
        ariaLabelKey="roleList"
        searchPlaceholderKey="searchGroup"
        toolbarItem={
          <>
            <Checkbox
              label={t("directMembership")}
              key="direct-membership-check"
              id="kc-direct-membership-checkbox"
              onChange={() => {
                setDirectMembership(!isDirectMembership);
                refresh();
              }}
              isChecked={isDirectMembership}
              className="pf-v5-u-mt-sm"
            />
            {enabled && (
              <Popover
                aria-label="Basic popover"
                position="bottom"
                bodyContent={<div>{t("whoWillAppearPopoverTextUsers")}</div>}
              >
                <Button
                  variant="link"
                  className="kc-who-will-appear-button"
                  key="who-will-appear-button"
                  icon={<QuestionCircleIcon />}
                >
                  {t("whoWillAppearLinkTextUsers")}
                </Button>
              </Popover>
            )}
          </>
        }
        columns={[
          {
            name: "groupMembership",
            displayKey: "groupMembership",
            cellRenderer: (group: GroupRepresentation) => group.name || "-",
            transforms: [cellWidth(40)],
          },
          {
            name: "path",
            displayKey: "path",
            cellRenderer: (group: GroupRepresentation) => (
              <GroupPath group={group} />
            ),
            transforms: [cellWidth(45)],
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon
            message={t("noGroupMemberships")}
            instructions={t("noGroupMembershipsText")}
          />
        }
      />
    </Modal>
  );
};
