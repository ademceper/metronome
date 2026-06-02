/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/permission-evaluation/PermissionsEvaluationTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type EvaluationResultRepresentation from "@keycloak/keycloak-admin-client/lib/defs/evaluationResultRepresentation";
import PolicyEvaluationResponse from "@keycloak/keycloak-admin-client/lib/defs/policyEvaluationResponse";
import type ResourceEvaluation from "@keycloak/keycloak-admin-client/lib/defs/resourceEvaluation";
import {
  ListEmptyState,
  SelectControl,
  useAlerts,
} from "../../../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { Bell as BellIcon } from "@phosphor-icons/react"
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { FormAccess } from "../../form/FormAccess";
import { UserSelect } from "../../users/UserSelect";
import { useAccess } from "../../../context/access/Access";
import { useRealm } from "../../../context/realm-context/RealmContext";
import { ForbiddenSection } from "../../forbidden-section";
import useSortedResourceTypes from "../../../utils/useSortedResourceTypes";
import { PermissionEvaluationResult } from "./PermissionEvaluationResult";
import { COMPONENTS } from "../resource-types/ResourceType";


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
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
const AlertActionCloseButton = ({ onClose, ...props }: any) => (
  <button type="button" onClick={onClose} className="ml-auto text-sm underline-offset-4 hover:underline" {...props}>Close</button>
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
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
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
  authScopes: string[];
  user: string[];
  clients: string[];
  groups: string[];
  users: string[];
  roles: string[];
  resourceType?: string;
}

type Props = {
  client: ClientRepresentation;
  save: () => void;
} & EvaluationResultRepresentation;

export const PermissionsEvaluationTab = (props: Props) => {
  const { hasAccess } = useAccess();

  if (!hasAccess("view-users")) {
    return <ForbiddenSection permissionNeeded="view-users" />;
  }

  return <PermissionEvaluateContent {...props} />;
};

const PermissionEvaluateContent = ({ client }: Props) => {
  const { t } = useTranslation();
  const { adminClient } = useAdminClient();
  const realm = useRealm();
  const { addError } = useAlerts();
  const form = useForm<EvaluateFormInputs>({
    mode: "onChange",
    defaultValues: {
      user: [],
      resourceType: "",
      authScopes: [],
    },
  });
  const { control, getValues, reset, trigger } = form;
  const [evaluateResult, setEvaluateResult] =
    useState<PolicyEvaluationResponse>();
  const [isAlertOpened, setIsAlertOpened] = useState(true);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const resourceTypes = useSortedResourceTypes({ clientId: client.id! });

  const selectedResourceType = useWatch({
    control: control,
    name: "resourceType",
    defaultValue: "",
  });

  const authScopes = useMemo(() => {
    const resource = resourceTypes.find((r) => r.type === selectedResourceType);
    return resource?.scopes || [];
  }, [selectedResourceType, resourceTypes]);

  const ResourceTypeComponent =
    COMPONENTS[selectedResourceType?.toLowerCase() || ""];

  const evaluate = async () => {
    if (!(await trigger())) {
      return;
    }

    const formValues = getValues();
    const getSingleValue = (source: string | string[]) => {
      return Array.isArray(source) ? source?.[0] : source;
    };

    const getResourceName = (resourceType: string) => {
      switch (resourceType) {
        case "Groups":
          return getSingleValue(formValues.groups);
        case "Users":
          return getSingleValue(formValues.users);
        case "Clients":
          return getSingleValue(formValues.clients);
        case "Roles":
          return getSingleValue(formValues.roles);
        default:
          return undefined;
      }
    };

    const resourceName = getResourceName(formValues.resourceType!);

    const resEval: ResourceEvaluation = {
      roleIds: formValues.roleIds ?? [],
      userId: formValues.user![0],
      resourceType: formValues.resourceType,
      resources: [
        {
          name: resourceName,
          scopes: formValues.authScopes!.map((scope) => ({ name: scope })),
        },
      ],
      entitlements: false,
      context: {
        attributes: {},
      },
    };

    try {
      const evaluation = await adminClient.clients.evaluateResource(
        { id: client.id!, realm: realm.realm },
        resEval,
      );

      setEvaluateResult(evaluation);
      setIsEvaluated(true);
    } catch (error) {
      addError("evaluateError", error);
    }
  };

  return (
    <PageSection>
      <Split hasGutter>
        <SplitItem>
          <FormProvider {...form}>
            <Panel>
              <PanelMainBody style={{ width: "50rem" }}>
                <FormAccess isHorizontal role="view-clients">
                  {isAlertOpened && (
                    <Alert
                      variant="info"
                      isInline
                      title={t("permissionsEvaluationInstructions")}
                      component="p"
                      actionClose={
                        <AlertActionCloseButton
                          onClose={() => setIsAlertOpened(false)}
                        />
                      }
                    />
                  )}
                  <UserSelect
                    name="user"
                    label={t("user")}
                    helpText={t("selectUser")}
                    defaultValue={[]}
                    variant="typeahead"
                    isRequired
                  />
                  <SelectControl
                    name="resourceType"
                    label={t("resourceType")}
                    labelIcon={t("resourceTypeSelectHelp")}
                    variant="single"
                    controller={{
                      defaultValue: resourceTypes.length
                        ? resourceTypes[0]?.type
                        : "",
                      rules: { required: true },
                    }}
                    options={resourceTypes.map((resource) => resource.type!)}
                  />
                  {ResourceTypeComponent && (
                    <ResourceTypeComponent
                      name={selectedResourceType?.toLowerCase()}
                      label={t(`${selectedResourceType}`)}
                      helpText={t(`select${selectedResourceType}`)}
                      defaultValue={[]}
                      variant="typeahead"
                      isRequired
                      isRadio
                    />
                  )}
                  <SelectControl
                    name="authScopes"
                    label={t("authScope")}
                    labelIcon={t("authScopeSelectHelp")}
                    controller={{ defaultValue: [] }}
                    variant="single"
                    options={authScopes}
                  />
                </FormAccess>
              </PanelMainBody>
            </Panel>
            <ActionGroup>
              <Button
                data-testid="permission-eval"
                id="permission-eval"
                className="pf-v5-u-mr-md"
                isDisabled={!form.formState.isValid}
                onClick={() => evaluate()}
              >
                {t("evaluate")}
              </Button>
              <Button
                data-testid="permission-eval-revert"
                id="permission-eval-revert"
                className="pf-v5-u-mr-md"
                variant="link"
                onClick={() => {
                  reset();
                  setEvaluateResult({});
                  setIsEvaluated(false);
                }}
              >
                {t("revert")}
              </Button>
            </ActionGroup>
          </FormProvider>
        </SplitItem>
        <SplitItem>
          <Panel>
            <PanelHeader>
              <Title headingLevel="h1" size="md">
                {t("permissionEvaluationPreview")}
              </Title>
            </PanelHeader>
            <PanelMainBody>
              {!isEvaluated ? (
                <ListEmptyState
                  icon={BellIcon}
                  message={t("noPermissionsEvaluationResults")}
                  instructions={t("noPermissionsEvaluationResultsInstructions")}
                />
              ) : (
                <PermissionEvaluationResult evaluateResult={evaluateResult!} />
              )}
            </PanelMainBody>
          </Panel>
        </SplitItem>
      </Split>
    </PageSection>
  );
};
