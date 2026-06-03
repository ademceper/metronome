/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/LinkIdentityProviderModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import {
  FormSubmitButton,
  SelectControl,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { DefaultSwitchControl } from "../switch-control";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import {
  convertAttributeNameToForm,
  convertFormValuesToObject,
  convertToFormValues,
} from "../../util";
import { IdentityProviderSelect } from "./identity-provider-select";
import { OrganizationFormType } from "./organization-form";


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

type LinkIdentityProviderModalProps = {
  orgId: string;
  identityProvider?: IdentityProviderRepresentation;
  onClose: () => void;
};

type LinkRepresentation = {
  alias: string[] | string;
  hideOnLogin: boolean;
  config: {
    "kc.org.domain": string;
  };
};

export const LinkIdentityProviderModal = ({
  orgId,
  identityProvider,
  onClose,
}: LinkIdentityProviderModalProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const form = useForm<LinkRepresentation>({ mode: "onChange" });
  const { handleSubmit, formState, setValue } = form;
  const { getValues } = useFormContext<OrganizationFormType>();

  useEffect(
    () =>
      convertToFormValues(
        {
          ...identityProvider,
          alias: [identityProvider?.alias],
          hideOnLogin: identityProvider?.hideOnLogin,
        },
        setValue,
      ),
    [],
  );

  const submitForm = async (data: LinkRepresentation) => {
    try {
      const foundIdentityProvider = await adminClient.identityProviders.findOne(
        {
          alias: data.alias[0],
        },
      );
      if (!foundIdentityProvider) {
        throw new Error(t("notFound"));
      }
      const { config } = convertFormValuesToObject(data);
      foundIdentityProvider.config = {
        ...foundIdentityProvider.config,
        ...config,
      };
      foundIdentityProvider.hideOnLogin = data.hideOnLogin ?? true;
      await adminClient.identityProviders.update(
        { alias: data.alias[0] },
        foundIdentityProvider,
      );

      if (!identityProvider) {
        await adminClient.organizations.linkIdp({
          orgId,
          alias: data.alias[0],
        });
      }
      addAlert(
        t(!identityProvider ? "linkSuccessful" : "linkUpdatedSuccessful"),
      );
      onClose();
    } catch (error) {
      addError(!identityProvider ? "linkError" : "linkUpdatedError", error);
    }
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("linkIdentityProvider")}
      isOpen
      onClose={onClose}
      actions={[
        <FormSubmitButton
          formState={formState}
          data-testid="confirm"
          key="confirm"
          form="form"
          allowInvalid
          allowNonDirty
        >
          {t("save")}
        </FormSubmitButton>,
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
      <FormProvider {...form}>
        <Form id="form" onSubmit={handleSubmit(submitForm)}>
          <IdentityProviderSelect
            name="alias"
            label={t("identityProvider")}
            defaultValue={[]}
            isRequired
            isDisabled={!!identityProvider}
          />
          <SelectControl
            name={convertAttributeNameToForm("config.kc.org.domain")}
            label={t("domain")}
            controller={{ defaultValue: "" }}
            options={[
              { key: "", value: t("none") },
              { key: "ANY", value: t("any") },
              ...(getValues("domains")
                ? getValues("domains")!.map((d) => ({ key: d, value: d }))
                : []),
            ]}
            menuAppendTo="parent"
          />
          <DefaultSwitchControl
            name="hideOnLogin"
            label={t("hideOnLoginPage")}
            labelIcon={t("hideOnLoginPageHelp")}
            defaultValue={true}
          />
          <DefaultSwitchControl
            name={convertAttributeNameToForm(
              "config.kc.org.broker.login.hide-when-org-unknown",
            )}
            label={t("hideOnLoginWhenOrgNotResolved")}
            labelIcon={t("hideOnLoginWhenOrgNotResolvedHelp")}
            stringify
          />
          <DefaultSwitchControl
            name={convertAttributeNameToForm(
              "config.kc.org.broker.redirect.mode.email-matches",
            )}
            label={t("redirectWhenEmailMatches")}
            labelIcon={t("redirectWhenEmailMatchesHelp")}
            stringify
          />
        </Form>
      </FormProvider>
    </Modal>
  );
};
