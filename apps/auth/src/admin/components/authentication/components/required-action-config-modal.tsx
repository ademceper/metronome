/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/components/RequiredActionConfigModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import RequiredActionConfigInfoRepresentation from "@keycloak/keycloak-admin-client/lib/defs/requiredActionConfigInfoRepresentation";
import RequiredActionConfigRepresentation from "@keycloak/keycloak-admin-client/lib/defs/requiredActionConfigRepresentation";
import type RequiredActionProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation";
import {
  isUserProfileError,
  setUserProfileServerError,
  useAlerts,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { Trash as TrashIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { DynamicComponents } from "../../dynamic/dynamic-components";
import { convertFormValuesToObject, convertToFormValues } from "../../../util";


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
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

type RequiredActionConfigModalForm = {
  // alias: string;
  config: { [index: string]: string };
};

type RequiredActionConfigModalProps = {
  requiredAction: RequiredActionProviderRepresentation;
  onClose: () => void;
};

export const RequiredActionConfigModal = ({
  requiredAction,
  onClose,
}: RequiredActionConfigModalProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const [configDescription, setConfigDescription] =
    useState<RequiredActionConfigInfoRepresentation>();

  const form = useForm<RequiredActionConfigModalForm>();
  const { setValue, handleSubmit } = form;

  // // default config all required actions should have
  // const defaultConfigProperties = [];

  const setupForm = (config?: RequiredActionConfigRepresentation) => {
    convertToFormValues(config || {}, setValue);
  };

  useFetch(
    async () => {
      const configDescription =
        await adminClient.authenticationManagement.getRequiredActionConfigDescription(
          {
            alias: requiredAction.alias!,
          },
        );

      const config =
        await adminClient.authenticationManagement.getRequiredActionConfig({
          alias: requiredAction.alias!,
        });

      // merge default and fetched config properties
      configDescription.properties = [
        //...defaultConfigProperties!,
        ...configDescription.properties!,
      ];

      return { configDescription, config };
    },
    ({ configDescription, config }) => {
      setConfigDescription(configDescription);
      setupForm(config);
    },
    [],
  );

  const save = async (saved: RequiredActionConfigModalForm) => {
    const newConfig = convertFormValuesToObject(saved);
    try {
      await adminClient.authenticationManagement.updateRequiredActionConfig(
        { alias: requiredAction.alias! },
        newConfig,
      );
      setupForm(newConfig);
      addAlert(t("configSaveSuccess"), AlertVariant.success);
      onClose();
    } catch (error) {
      if (isUserProfileError(error)) {
        setUserProfileServerError(
          error,
          (name: string | number, error: unknown) => {
            // TODO: Does not set set the error message to the field, yet.
            // Still, this will do all front end replacement and translation of keys.
            addError("configSaveError", (error as any).message);
          },
          t,
        );
      } else {
        addError("configSaveError", error);
      }
    }
  };

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen
      title={t("requiredActionConfig", { name: requiredAction.name })}
      onClose={onClose}
    >
      <Form id="required-action-config-form" onSubmit={handleSubmit(save)}>
        <FormProvider {...form}>
          <DynamicComponents
            stringify
            properties={configDescription?.properties || []}
          />
        </FormProvider>
        <ActionGroup>
          <Button data-testid="save" variant="primary" type="submit">
            {t("save")}
          </Button>
          <Button
            data-testid="cancel"
            variant={ButtonVariant.link}
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button
            className="pf-v5-u-ml-3xl"
            data-testid="clear"
            variant={ButtonVariant.link}
            onClick={async () => {
              await adminClient.authenticationManagement.removeRequiredActionConfig(
                {
                  alias: requiredAction.alias!,
                },
              );
              form.reset({});
              onClose();
            }}
          >
            {t("clear")} <TrashIcon />
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
