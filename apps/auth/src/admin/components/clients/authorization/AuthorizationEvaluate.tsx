/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/AuthorizationEvaluate.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type EvaluationResultRepresentation from "@keycloak/keycloak-admin-client/lib/defs/evaluationResultRepresentation";
import type PolicyEvaluationResponse from "@keycloak/keycloak-admin-client/lib/defs/policyEvaluationResponse";
import type ResourceEvaluation from "@keycloak/keycloak-admin-client/lib/defs/resourceEvaluation";
import type ResourceRepresentation from "@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import type ScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation";
import {
  HelpItem,
  SelectControl,
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Collapsible as UICollapsible, CollapsibleContent as UICollapsibleContent, CollapsibleTrigger as UICollapsibleTrigger } from "@metronome/ui/components/collapsible";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ForbiddenSection } from "../../forbidden-section";
import { useAdminClient } from "../../../admin-client";
import { ClientSelect } from "../../client/ClientSelect";
import { FormAccess } from "../../form/FormAccess";
import {
  KeyValueType,
  keyValueToArray,
} from "../../key-value-form/key-value-convert";
import { UserSelect } from "../../users/UserSelect";
import { useAccess } from "../../../context/access/Access";
import { useRealm } from "../../../context/realm-context/RealmContext";
import { FormFields } from "../ClientDetails";
import { defaultContextAttributes } from "../utils";
import { KeyBasedAttributeInput } from "./KeyBasedAttributeInput";
import { Results } from "./evaluate/Results";


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
const ExpandableSection = ({ toggleText, toggleTextExpanded, toggleTextCollapsed, isExpanded, onToggle, isDetached, children, ...props }: any) => (
  <UICollapsible open={isExpanded} onOpenChange={(open: boolean) => onToggle?.(undefined, open)} {...props}>
    <UICollapsibleTrigger className="flex items-center gap-2 text-sm">
      {isExpanded ? (toggleTextExpanded ?? toggleText) : (toggleTextCollapsed ?? toggleText)}
    </UICollapsibleTrigger>
    <UICollapsibleContent>{children}</UICollapsibleContent>
  </UICollapsible>
);
const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Panel = ({ children, className, ...props }: any) => (
  <div className={cn("rounded-md border bg-card", className)} {...props}>{children}</div>
);
const PanelHeader = ({ children, className, ...props }: any) => (
  <div className={cn("border-b px-3 py-2 font-medium text-sm", className)} {...props}>{children}</div>
);
const PanelMainBody = ({ children, className, ...props }: any) => (
  <div className={cn("px-3 py-2 text-sm", className)} {...props}>{children}</div>
);
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);
const TitleSizes = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;
const Title = ({ headingLevel = "h1", size, children, className, ...props }: any) =>
  React.createElement(headingLevel, {
    className: cn("font-heading font-medium", (TitleSizes as any)[size as string] ?? "text-base", className),
    ...props,
  }, children);

interface EvaluateFormInputs extends Omit<
  ResourceEvaluation,
  "context" | "resources"
> {
  alias: string;
  authScopes: string[];
  context: {
    attributes: Record<string, string>[];
  };
  resources?: Record<string, string>[];
  client: FormFields;
  user: string[];
}

export type AttributeType = {
  key: string;
  name: string;
  custom?: boolean;
  values?: {
    [key: string]: string;
  }[];
};

type ClientSettingsProps = {
  client: ClientRepresentation;
  save: () => void;
};

export type AttributeForm = Omit<
  EvaluateFormInputs,
  "context" | "resources"
> & {
  context: {
    attributes?: KeyValueType[];
  };
  resources?: KeyValueType[];
};

type Props = ClientSettingsProps & EvaluationResultRepresentation;

export const AuthorizationEvaluate = (props: Props) => {
  const { hasAccess } = useAccess();

  if (!hasAccess("view-users")) {
    return <ForbiddenSection permissionNeeded="view-users" />;
  }

  return <AuthorizationEvaluateContent {...props} />;
};

const AuthorizationEvaluateContent = ({ client }: Props) => {
  const { adminClient } = useAdminClient();

  const form = useForm<EvaluateFormInputs>({ mode: "onChange" });
  const {
    reset,
    trigger,
    formState: { isValid },
  } = form;
  const { t } = useTranslation();
  const { addError } = useAlerts();
  const realm = useRealm();
  const [isExpanded, setIsExpanded] = useState(false);
  const [applyToResourceType, setApplyToResourceType] = useState(false);
  const [resources, setResources] = useState<ResourceRepresentation[]>([]);
  const [scopes, setScopes] = useState<ScopeRepresentation[]>([]);
  const [evaluateResult, setEvaluateResult] =
    useState<PolicyEvaluationResponse>();
  const [clientRoles, setClientRoles] = useState<RoleRepresentation[]>([]);

  useFetch(
    () => adminClient.roles.find(),
    (roles) => {
      setClientRoles(roles);
    },
    [],
  );

  useFetch(
    () =>
      Promise.all([
        adminClient.clients.listResources({
          id: client.id!,
        }),
        adminClient.clients.listAllScopes({
          id: client.id!,
        }),
      ]),
    ([resources, scopes]) => {
      setResources(resources);
      setScopes(scopes);
    },
    [],
  );

  const evaluate = async () => {
    if (!(await trigger())) {
      return;
    }
    const formValues = form.getValues();
    const keys = keyValueToArray(formValues.resources as KeyValueType[]);
    const resEval: ResourceEvaluation = {
      roleIds: formValues.roleIds ?? [],
      clientId: formValues.client.id!,
      userId: formValues.user![0],
      resources: resources
        .filter((resource) => Object.keys(keys).includes(resource.name!))
        .map((r) => ({
          ...r,
          scopes: r.scopes?.filter((s) =>
            Object.values(keys)
              .flatMap((v) => v)
              .includes(s.name!),
          ),
        })),
      entitlements: false,
      context: {
        attributes: Object.fromEntries(
          formValues.context.attributes
            .filter((item) => item.key || item.value !== "")
            .map(({ key, value }) => [key, value]),
        ),
      },
    };

    try {
      const evaluation = await adminClient.clients.evaluateResource(
        { id: client.id!, realm: realm.realm },
        resEval,
      );

      setEvaluateResult(evaluation);
    } catch (error) {
      addError("evaluateError", error);
    }
  };

  if (evaluateResult) {
    return (
      <Results
        evaluateResult={evaluateResult}
        refresh={evaluate}
        back={() => setEvaluateResult(undefined)}
      />
    );
  }

  return (
    <PageSection>
      <FormProvider {...form}>
        <Panel>
          <PanelHeader>
            <Title headingLevel="h2">{t("identityInformation")}</Title>
          </PanelHeader>
          <PanelMainBody>
            <FormAccess isHorizontal role="view-clients">
              <ClientSelect
                name="client"
                label="client"
                helpText={"clientHelp"}
                defaultValue={client.clientId}
              />
              <UserSelect
                name="user"
                label="users"
                helpText={t("selectUser")}
                defaultValue={[]}
                variant="typeahead"
                isRequired
              />
              <SelectControl
                name="roleIds"
                label={t("roles")}
                labelIcon={t("rolesHelp")}
                variant="typeaheadMulti"
                placeholderText={t("selectARole")}
                controller={{
                  defaultValue: [],
                  rules: {
                    required: true,
                  },
                }}
                options={clientRoles.map((role) => role.name!)}
              />
            </FormAccess>
          </PanelMainBody>
        </Panel>
        <Panel>
          <PanelHeader>
            <Title headingLevel="h2">{t("permissions")}</Title>
          </PanelHeader>
          <PanelMainBody>
            <FormAccess isHorizontal role="view-clients">
              <FormGroup
                label={t("applyToResourceType")}
                fieldId="applyToResourceType"
                labelIcon={
                  <HelpItem
                    helpText={t("applyToResourceTypeHelp")}
                    fieldLabelId="applyToResourceType"
                  />
                }
              >
                <Switch
                  id="applyToResource-switch"
                  label={t("on")}
                  labelOff={t("off")}
                  isChecked={applyToResourceType}
                  onChange={(_event, val) => setApplyToResourceType(val)}
                  aria-label={t("applyToResourceType")}
                />
              </FormGroup>
              {!applyToResourceType ? (
                <FormGroup
                  label={t("resourcesAndScopes")}
                  id="resourcesAndScopes"
                  labelIcon={
                    <HelpItem
                      helpText={t("contextualAttributesHelp")}
                      fieldLabelId={`resourcesAndScopes`}
                    />
                  }
                  fieldId="resourcesAndScopes"
                >
                  <KeyBasedAttributeInput
                    selectableValues={resources.map<AttributeType>((item) => ({
                      name: item.name!,
                      key: item._id!,
                    }))}
                    resources={resources}
                    name="resources"
                  />
                </FormGroup>
              ) : (
                <>
                  <TextControl
                    name="alias"
                    label={t("resourceType")}
                    labelIcon={t("resourceTypeHelp")}
                    rules={{ required: t("required") }}
                  />
                  <SelectControl
                    name="authScopes"
                    label={t("authScopes")}
                    labelIcon={t("scopesSelect")}
                    controller={{
                      defaultValue: [],
                    }}
                    variant="typeaheadMulti"
                    options={scopes.map((s) => s.name!)}
                  />
                </>
              )}
              <ExpandableSection
                toggleText={t("contextualInfo")}
                onToggle={() => setIsExpanded(!isExpanded)}
                isExpanded={isExpanded}
              >
                <FormGroup
                  label={t("contextualAttributes")}
                  id="contextualAttributes"
                  labelIcon={
                    <HelpItem
                      helpText={t("contextualAttributesHelp")}
                      fieldLabelId={`contextualAttributes`}
                    />
                  }
                  fieldId="contextualAttributes"
                >
                  <KeyBasedAttributeInput
                    selectableValues={defaultContextAttributes}
                    name="context.attributes"
                  />
                </FormGroup>
              </ExpandableSection>
            </FormAccess>
          </PanelMainBody>
        </Panel>
        <ActionGroup>
          <Button
            data-testid="authorization-eval"
            id="authorization-eval"
            className="pf-v5-u-mr-md"
            isDisabled={!isValid}
            onClick={() => evaluate()}
          >
            {t("evaluate")}
          </Button>
          <Button
            data-testid="authorization-revert"
            id="authorization-revert"
            className="pf-v5-u-mr-md"
            variant="link"
            onClick={() => reset()}
          >
            {t("revert")}
          </Button>
        </ActionGroup>
      </FormProvider>
    </PageSection>
  );
};
