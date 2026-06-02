/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/components/UsedBy.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { KeycloakDataTable } from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@metronome/ui/components/popover";
import { cn } from "@metronome/ui/lib/utils";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { fetchUsedBy } from "../../role-mapping/resource";
import { useRealm } from "../../../context/realm-context/realm-context";
import useToggle from "../../../utils/use-toggle";
import { AuthenticationType, REALM_FLOWS } from "../constants";

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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;

type UsedByProps = {
  authType: AuthenticationType;
};

const Label = ({ label }: { label: string }) => (
  <>
    <CheckCircleIcon className={""} /> {label}
  </>
);

type UsedByModalProps = {
  id: string;
  onClose: () => void;
  isSpecificClient: boolean;
};

const UsedByModal = ({ id, isSpecificClient, onClose }: UsedByModalProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();

  const loader = async (
    first?: number,
    max?: number,
    search?: string,
  ): Promise<{ name: string }[]> => {
    const result = await fetchUsedBy(adminClient, {
      id,
      type: isSpecificClient ? "clients" : "idp",
      first: first || 0,
      max: max || 10,
      search,
    });
    return result.map((p) => ({ name: p }));
  };

  return (
    <Modal
      header={
        <TextContent>
          <Text component={TextVariants.h1}>{t("flowUsedBy")}</Text>
          <Text>
            {t("flowUsedByDescription", {
              value: isSpecificClient ? t("clients") : t("identiyProviders"),
            })}
          </Text>
        </TextContent>
      }
      variant={ModalVariant.medium}
      isOpen
      onClose={onClose}
      actions={[
        <Button
          data-testid="cancel"
          id="modal-cancel"
          key="cancel"
          onClick={onClose}
        >
          {t("close")}
        </Button>,
      ]}
    >
      <KeycloakDataTable
        loader={loader}
        isPaginated
        ariaLabelKey="usedBy"
        searchPlaceholderKey="search"
        columns={[
          {
            name: "name",
          },
        ]}
      />
    </Modal>
  );
};

export const UsedBy = ({ authType: { id, usedBy } }: UsedByProps) => {
  const { t } = useTranslation();
  const { realmRepresentation: realm } = useRealm();
  const [open, toggle] = useToggle();

  const key = Object.entries(realm!).find(
    (e) => e[1] === usedBy?.values[0],
  )?.[0];

  return (
    <>
      {open && (
        <UsedByModal
          id={id!}
          onClose={toggle}
          isSpecificClient={usedBy?.type === "SPECIFIC_CLIENTS"}
        />
      )}
      {(usedBy?.type === "SPECIFIC_PROVIDERS" ||
        usedBy?.type === "SPECIFIC_CLIENTS") &&
        (usedBy.values.length <= 8 ? (
          <Popover
            key={id}
            aria-label={t("usedBy")}
            bodyContent={
              <div key={`usedBy-${id}-${usedBy.values}`}>
                {t(
                  "appliedBy" +
                    (usedBy.type === "SPECIFIC_CLIENTS"
                      ? "Clients"
                      : "Providers"),
                )}{" "}
                {usedBy.values.map((used, index) => (
                  <>
                    <strong>{used}</strong>
                    {index < usedBy.values.length - 1 ? ", " : ""}
                  </>
                ))}
              </div>
            }
          >
            <Button variant="link" className={""}>
              <Label label={t(`used.${usedBy.type}`)} />
            </Button>
          </Popover>
        ) : (
          <Button variant="link" className={""} onClick={toggle}>
            <Label label={t(`used.${usedBy.type}`)} />
          </Button>
        ))}
      {usedBy?.type === "DEFAULT" && (
        <Label label={t(`flow.${REALM_FLOWS.get(key!)}`)} />
      )}
      {!usedBy?.type && t("used.notInUse")}
    </>
  );
};
