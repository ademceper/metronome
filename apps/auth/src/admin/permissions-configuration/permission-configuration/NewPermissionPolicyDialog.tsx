/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/permission-configuration/NewPermissionPolicyDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import PolicyRepresentation, {
  DecisionStrategy,
  Logic,
} from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import PolicyProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyProviderRepresentation";
import { useTranslation } from "react-i18next";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import {
  SelectControl,
  TextControl,
  useAlerts,
} from "../../../shared/keycloak-ui-shared";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useAdminClient } from "../../admin-client";
import { useRealm } from "../../context/realm-context/RealmContext";
import { Client } from "../../clients/authorization/policy/Client";
import { User } from "../../clients/authorization/policy/User";
import {
  ClientScope,
  RequiredIdValue,
} from "../../clients/authorization/policy/ClientScope";
import { Group, GroupValue } from "../../clients/authorization/policy/Group";
import { Regex } from "../../clients/authorization/policy/Regex";
import { Role } from "../../clients/authorization/policy/Role";
import { Time } from "../../clients/authorization/policy/Time";
import { JavaScript } from "../../clients/authorization/policy/JavaScript";
import { LogicSelector } from "../../clients/authorization/policy/LogicSelector";
import { Aggregate } from "../../clients/authorization/policy/Aggregate";
import { capitalize } from "lodash-es";
import { useEffect, type JSX } from "react";


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
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;
const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
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
const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;

type Policy = Omit<PolicyRepresentation, "roles"> & {
  groups?: GroupValue[];
  clientScopes?: RequiredIdValue[];
  roles?: RequiredIdValue[];
  clients?: [];
};

type ComponentsProps = {
  isPermissionClient?: boolean;
  permissionClientId: string;
};

const defaultValues: Policy = {
  name: "",
  description: "",
  type: "group",
  policies: [],
  decisionStrategy: DecisionStrategy.UNANIMOUS,
  logic: Logic.POSITIVE,
};

const COMPONENTS: {
  [index: string]: ({
    isPermissionClient,
    permissionClientId,
  }: ComponentsProps) => JSX.Element;
} = {
  aggregate: Aggregate,
  client: Client,
  user: User,
  "client-scope": ClientScope,
  group: Group,
  regex: Regex,
  role: Role,
  time: Time,
  js: JavaScript,
  default: Group,
} as const;

export const isValidComponentType = (value: string) => value in COMPONENTS;

type NewPermissionConfigurationDialogProps = {
  permissionClientId: string;
  providers: PolicyProviderRepresentation[];
  policies: PolicyRepresentation[];
  resourceType: string;
  toggleDialog: () => void;
  onAssign: (newPolicy: PolicyRepresentation) => void;
};

export const NewPermissionPolicyDialog = ({
  permissionClientId,
  providers,
  policies,
  toggleDialog,
  onAssign,
}: NewPermissionConfigurationDialogProps) => {
  const { adminClient } = useAdminClient();
  const { realmRepresentation } = useRealm();
  const { t } = useTranslation();
  const form = useForm<Policy>({
    mode: "onChange",
    defaultValues,
  });
  const { addAlert, addError } = useAlerts();
  const { handleSubmit, reset } = form;
  const isPermissionClient = realmRepresentation?.adminPermissionsEnabled;

  const policyTypeSelector = useWatch({
    control: form.control,
    name: "type",
  });

  function getComponentType() {
    if (policyTypeSelector && isValidComponentType(policyTypeSelector)) {
      return COMPONENTS[policyTypeSelector];
    }
    return COMPONENTS["default"];
  }

  const ComponentType = getComponentType();

  useEffect(() => {
    if (policyTypeSelector) {
      const { name, description, decisionStrategy, logic } = form.getValues();

      reset({
        type: policyTypeSelector,
        name,
        description,
        decisionStrategy,
        logic,
      });
    }
  }, [policyTypeSelector, reset, form]);

  const save = async (policy: Policy) => {
    const { groups, roles, policies, clients, ...rest } = policy;

    const cleanedPolicy = {
      ...rest,
      ...(groups && groups.length > 0 && { groups }),
      ...(roles && roles.length > 0 && { roles }),
      ...(policies && policies.length > 0 && { policies }),
      ...(clients && clients.length > 0 && { clients }),
      ...(rest.type === "group" &&
        (!groups || groups.length === 0) && { groups: [] }),
      ...(rest.type === "client" &&
        (!clients || clients.length === 0) && { clients: [] }),
    };

    try {
      const createdPolicy = await adminClient.clients.createPolicy(
        { id: permissionClientId, type: policyTypeSelector! },
        cleanedPolicy,
      );

      onAssign(createdPolicy);
      toggleDialog();
      addAlert(t("createPolicySuccess"), AlertVariant.success);
    } catch (error) {
      addError("policySaveError", error);
    }
  };

  return (
    <Modal
      aria-label={t("createPermissionPolicy")}
      variant={ModalVariant.medium}
      header={
        <TextContent>
          <Text component={TextVariants.h1}>{t("createPermissionPolicy")}</Text>
        </TextContent>
      }
      isOpen
      onClose={toggleDialog}
    >
      <Form
        id="createPermissionPolicy-form"
        onSubmit={async (e) => {
          e.stopPropagation();
          await handleSubmit(save)(e);
        }}
        isHorizontal
      >
        <FormProvider {...form}>
          <TextControl
            name="name"
            label={t("name")}
            rules={{ required: t("required") }}
          />
          <TextControl name="description" label={t("description")} />
          {providers && providers.length > 0 && (
            <SelectControl
              name="type"
              label={t("policyType")}
              labelIcon={t("policyTypeHelpText")}
              options={providers.map((provider) => ({
                key: provider.type!,
                value: capitalize(provider.type!),
              }))}
              controller={{ defaultValue: "" }}
            />
          )}
          <ComponentType
            isPermissionClient={isPermissionClient}
            permissionClientId={permissionClientId}
          />
          <LogicSelector />
        </FormProvider>
        <ActionGroup>
          <div className="pf-v5-u-mt-md">
            <Button
              variant={ButtonVariant.primary}
              className="pf-v5-u-mr-md"
              type="submit"
              data-testid="save"
              isDisabled={
                policies?.length === 0 && policyTypeSelector === "aggregate"
              }
            >
              {t("save")}
            </Button>
            <Button variant="link" data-testid="cancel" onClick={toggleDialog}>
              {t("cancel")}
            </Button>
          </div>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
