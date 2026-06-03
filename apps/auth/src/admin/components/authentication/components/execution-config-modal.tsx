/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/components/ExecutionConfigModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type AuthenticatorConfigInfoRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigInfoRepresentation";
import type AuthenticatorConfigRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigRepresentation";
import {
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { Gear as CogIcon, Trash as TrashIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { DynamicComponents } from "../../dynamic/dynamic-components";
import { convertFormValuesToObject, convertToFormValues } from "../../../util";
import type { ExpandableExecution } from "../execution-model";


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
const Tooltip = ({ content, children, ...props }: any) => <>{children}</>;

type ExecutionConfigModalForm = {
  alias: string;
  config: { [index: string]: string };
};

type ExecutionConfigModalProps = {
  execution: ExpandableExecution;
};

export const ExecutionConfigModal = ({
  execution,
}: ExecutionConfigModalProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const [show, setShow] = useState(false);
  const [config, setConfig] = useState<AuthenticatorConfigRepresentation>();
  const [configDescription, setConfigDescription] =
    useState<AuthenticatorConfigInfoRepresentation>();

  const form = useForm<ExecutionConfigModalForm>();
  const { setValue, handleSubmit } = form;

  // default config all executions should have
  const defaultConfigProperties = execution.authenticationFlow
    ? []
    : [
        {
          helpText: t("authenticatorRefConfig.value.help"),
          label: t("authenticatorRefConfig.value.label"),
          name: "default.reference.value",
          readOnly: false,
          secret: false,
          type: "String",
        },
        {
          helpText: t("authenticatorRefConfig.maxAge.help"),
          label: t("authenticatorRefConfig.maxAge.label"),
          name: "default.reference.maxAge",
          readOnly: false,
          secret: false,
          type: "String",
        },
      ];

  const setupForm = (config?: AuthenticatorConfigRepresentation) => {
    convertToFormValues(config || {}, setValue);
  };

  useFetch(
    async () => {
      let config: AuthenticatorConfigRepresentation | undefined;

      const configDescription = execution.configurable
        ? await adminClient.authenticationManagement.getConfigDescription({
            providerId: execution.providerId!,
          })
        : {
            name: execution.displayName,
            properties: [],
          };

      if (execution.authenticationConfig) {
        config = await adminClient.authenticationManagement.getConfig({
          id: execution.authenticationConfig,
        });
      }

      // merge default and fetched config properties
      configDescription.properties = [
        ...defaultConfigProperties!,
        ...configDescription.properties!,
      ];

      return { configDescription, config };
    },
    ({ configDescription, config }) => {
      setConfigDescription(configDescription);
      setConfig(config);
    },
    [],
  );

  useEffect(() => {
    if (config) setupForm(config);
  }, [config]);

  const save = async (saved: ExecutionConfigModalForm) => {
    const changedConfig = convertFormValuesToObject(saved);
    try {
      if (config) {
        const newConfig = {
          id: config.id,
          alias: config.alias,
          config: changedConfig.config,
        };
        await adminClient.authenticationManagement.updateConfig(newConfig);
        setConfig({ ...newConfig });
      } else {
        const newConfig = {
          id: execution.id!,
          alias: changedConfig.alias,
          config: changedConfig.config,
        };
        const { id } =
          await adminClient.authenticationManagement.createConfig(newConfig);
        setConfig({ ...newConfig.config, id, alias: newConfig.alias });
      }
      addAlert(t("configSaveSuccess"), AlertVariant.success);
      setShow(false);
    } catch (error) {
      addError("configSaveError", error);
    }
  };

  return (
    <>
      <Tooltip content={t("settings")}>
        <Button
          variant="plain"
          aria-label={t("settings")}
          onClick={() => setShow(true)}
        >
          <CogIcon />
        </Button>
      </Tooltip>
      {configDescription && (
        <Modal
          variant={ModalVariant.small}
          isOpen={show}
          title={t("executionConfig", { name: configDescription.name })}
          onClose={() => setShow(false)}
        >
          <Form id="execution-config-form" onSubmit={handleSubmit(save)}>
            <FormProvider {...form}>
              <TextControl
                name="alias"
                label={t("alias")}
                labelIcon={t("authenticationAliasHelp")}
                rules={{ required: t("required") }}
                isDisabled={!!config}
              />
              <DynamicComponents
                stringify
                properties={configDescription.properties || []}
              />
            </FormProvider>
            <ActionGroup>
              <Button data-testid="save" variant="primary" type="submit">
                {t("save")}
              </Button>
              <Button
                data-testid="cancel"
                variant={ButtonVariant.link}
                onClick={() => {
                  setShow(false);
                }}
              >
                {t("cancel")}
              </Button>
              {config && (
                <Button
                  className="pf-v5-u-ml-4xl"
                  data-testid="clear"
                  variant={ButtonVariant.link}
                  onClick={async () => {
                    await adminClient.authenticationManagement.delConfig({
                      id: config.id!,
                    });
                    setConfig(undefined);
                    setShow(false);
                  }}
                >
                  {t("clear")} <TrashIcon />
                </Button>
              )}
            </ActionGroup>
          </Form>
        </Modal>
      )}
    </>
  );
};
