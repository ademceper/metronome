/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/components/modals/AddStepModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { AuthenticationProviderRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigRepresentation";
import {
  PaginatingTableToolbar,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import useLocaleSort, { mapByKey } from "../../../utils/useLocaleSort";
import { providerConditionFilter } from "../../FlowDetails";


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
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Radio = ({ id, name, label, description, isChecked, onChange, isDisabled, value, ...props }: any) => (
  <div className="flex items-start gap-2">
    <input type="radio" id={id} name={name} value={value} checked={!!isChecked} disabled={isDisabled}
      onChange={(e) => onChange?.(e, e.target.checked)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);

type AuthenticationProviderListProps = {
  list?: AuthenticationProviderRepresentation[];
  setValue: (provider?: AuthenticationProviderRepresentation) => void;
};

const AuthenticationProviderList = ({
  list,
  setValue,
}: AuthenticationProviderListProps) => {
  return (
    <PageSection variant="light" className="pf-v5-u-py-lg">
      <Form isHorizontal>
        {list?.map((provider) => (
          <Radio
            id={provider.id!}
            key={provider.id}
            name="provider"
            label={provider.displayName}
            data-testid={provider.id}
            description={provider.description}
            onChange={() => {
              setValue(provider);
            }}
          />
        ))}
      </Form>
    </PageSection>
  );
};

export type FlowType = "client" | "form" | "basic" | "condition" | "subFlow";

type AddStepModalProps = {
  name: string;
  type: FlowType;
  onSelect: (value?: AuthenticationProviderRepresentation) => void;
};

export const AddStepModal = ({ name, type, onSelect }: AddStepModalProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();

  const [value, setValue] = useState<AuthenticationProviderRepresentation>();
  const [providers, setProviders] =
    useState<AuthenticationProviderRepresentation[]>();
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [search, setSearch] = useState("");
  const localeSort = useLocaleSort();

  useFetch(
    async () => {
      switch (type) {
        case "client":
          return adminClient.authenticationManagement.getClientAuthenticatorProviders();
        case "form":
          return adminClient.authenticationManagement.getFormActionProviders();
        case "condition": {
          const providers =
            await adminClient.authenticationManagement.getAuthenticatorProviders();
          return providers.filter(providerConditionFilter);
        }
        case "basic":
        default: {
          const providers =
            await adminClient.authenticationManagement.getAuthenticatorProviders();
          return providers.filter((p) => !providerConditionFilter(p));
        }
      }
    },
    (providers) => setProviders(providers),
    [],
  );

  const page = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return localeSort(providers ?? [], mapByKey("displayName"))
      .filter(
        ({ displayName, description }) =>
          displayName?.toLowerCase().includes(normalizedSearch) ||
          description?.toLowerCase().includes(normalizedSearch),
      )
      .slice(first, first + max + 1);
  }, [providers, search, first, max]);

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={true}
      title={
        type == "condition"
          ? t("addConditionTo", { name })
          : t("addExecutionTo", { name })
      }
      onClose={() => onSelect()}
      actions={[
        <Button
          id="modal-add"
          data-testid="modal-add"
          key="add"
          onClick={() => onSelect(value)}
        >
          {t("add")}
        </Button>,
        <Button
          data-testid="cancel"
          id="modal-cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={() => {
            onSelect();
          }}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      {providers && (
        <PaginatingTableToolbar
          count={page.length || 0}
          first={first}
          max={max}
          onNextClick={setFirst}
          onPreviousClick={setFirst}
          onPerPageSelect={(first, max) => {
            setFirst(first);
            setMax(max);
          }}
          inputGroupName="search"
          inputGroupPlaceholder={t("search")}
          inputGroupOnEnter={setSearch}
        >
          <AuthenticationProviderList
            list={page.slice(0, max)}
            setValue={setValue}
          />
        </PaginatingTableToolbar>
      )}
    </Modal>
  );
};
