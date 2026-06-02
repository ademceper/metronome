// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import { useAlerts, useFetch } from "../../../../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { useState, type JSX } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../../../admin-client";
import { useConfirmDialog } from "../../../../../../../components/confirm-dialog/ConfirmDialog";
import { FormAccess } from "../../../../../../../components/form/FormAccess";
import { KeycloakSpinner } from "../../../../../../../../shared/keycloak-ui-shared";
import { ViewHeader } from "../../../../../../../components/view-header/ViewHeader";
import { useParams } from "../../../../../../../utils/use-params";
import { toAuthorizationTab } from "../../../../../../../lib/clients";
import {
  PolicyDetailsParams,
  toPolicyDetails,
} from "../../../../../../../lib/clients";
import { useIsAdminPermissionsClient } from "../../../../../../../utils/use-is-admin-permissions-client";
import { toPermissionsConfigurationTabs } from "../../../../../../../lib/permissions-configuration";
import { NewPermissionPolicyDetailsParams } from "../../../../../../../lib/permissions-configuration";
import { toPermissionPolicyDetails } from "../../../../../../../lib/permissions-configuration";
import { Aggregate } from "../../../../../../../components/clients/authorization/policy/Aggregate";
import { Client } from "../../../../../../../components/clients/authorization/policy/Client";
import { ClientScope, RequiredIdValue } from "../../../../../../../components/clients/authorization/policy/ClientScope";
import { Group, GroupValue } from "../../../../../../../components/clients/authorization/policy/Group";
import { JavaScript } from "../../../../../../../components/clients/authorization/policy/JavaScript";
import { LogicSelector } from "../../../../../../../components/clients/authorization/policy/LogicSelector";
import { NameDescription } from "../../../../../../../components/clients/authorization/policy/NameDescription";
import { Regex } from "../../../../../../../components/clients/authorization/policy/Regex";
import { Role } from "../../../../../../../components/clients/authorization/policy/Role";
import { Time } from "../../../../../../../components/clients/authorization/policy/Time";
import { User } from "../../../../../../../components/clients/authorization/policy/User";

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
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

type Policy = Omit<PolicyRepresentation, "roles"> & {
  groups?: GroupValue[];
  clientScopes?: RequiredIdValue[];
  roles?: RequiredIdValue[];
};

const COMPONENTS: {
  [index: string]: () => JSX.Element;
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
} as const;

export const isValidComponentType = (value: string) => value in COMPONENTS;

function PolicyDetails() {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const { id, realm, policyId, policyType } = useParams<PolicyDetailsParams>();
  const { permissionClientId } = useParams<NewPermissionPolicyDetailsParams>();
  const navigate = useNavigate();
  const form = useForm();
  const { reset, handleSubmit } = form;
  const { addAlert, addError } = useAlerts();
  const [policy, setPolicy] = useState<PolicyRepresentation>();
  const isDisabled = policyType === "js";
  const isAdminPermissionsClient =
    useIsAdminPermissionsClient(permissionClientId);

  useFetch(
    async () => {
      if (policyId) {
        const result = await Promise.all([
          adminClient.clients.findOnePolicyWithType({
            id: permissionClientId ?? id,
            type: policyType!,
            policyId,
          }) as PolicyRepresentation | undefined,
          adminClient.clients.getAssociatedPolicies({
            id: permissionClientId ?? id,
            permissionId: policyId,
          }),
        ]);

        if (!result[0]) {
          throw new Error(t("notFound"));
        }

        return {
          policy: result[0],
          policies: result[1].map((p) => p.id),
        };
      }
      if (!isValidComponentType(policyType!)) {
        const providers = await adminClient.clients.listPolicyProviders({
          id: permissionClientId ?? id,
        });
        const provider = providers.find((p) => p.type === policyType);
        if (provider) {
          return {
            policy: {
              code: provider.code,
              description: provider.description,
            } as PolicyRepresentation,
          };
        }
      }
      return {};
    },
    ({ policy, policies }) => {
      reset({ ...policy, policies });
      setPolicy(policy);
    },
    [permissionClientId, id, policyType, policyId],
  );

  const onSubmitPolicy = async (policy: Policy) => {
    policy.groups = policy.groups?.filter((g) => g.id);
    policy.clientScopes = policy.clientScopes?.filter((c) => c.id);
    policy.roles = policy.roles
      ?.filter((r) => r.id)
      .map((r) => ({ ...r, required: r.required || false }));

    const clientId = isAdminPermissionsClient ? permissionClientId : id;
    const navigateTo = isAdminPermissionsClient
      ? toPermissionPolicyDetails
      : toPolicyDetails;

    try {
      if (policyId) {
        await adminClient.clients.updatePolicy(
          { id: clientId!, type: policyType!, policyId },
          policy,
        );
      } else {
        const result = await adminClient.clients.createPolicy(
          { id: clientId!, type: policyType! },
          policy,
        );

        navigate(
          navigateTo({
            realm: realm!,
            id: clientId!,
            permissionClientId: clientId!,
            policyId: result.id!,
            policyType: result.type!,
          }),
        );
      }
      addAlert(
        t((policyId ? "update" : "create") + "PolicySuccess"),
        AlertVariant.success,
      );
    } catch (error) {
      addError("policySaveError", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deletePolicy",
    messageKey: "deletePolicyConfirm",
    continueButtonLabel: "confirm",
    onConfirm: async () => {
      try {
        await adminClient.clients.delPolicy({
          id: isAdminPermissionsClient ? permissionClientId : id,
          policyId,
        });
        addAlert(t("policyDeletedSuccess"), AlertVariant.success);
        navigate(
          isAdminPermissionsClient
            ? toPermissionsConfigurationTabs({
                realm: realm!,
                permissionClientId,
                tab: "policies",
              })
            : toAuthorizationTab({ realm, clientId: id, tab: "policies" }),
        );
      } catch (error) {
        addError("policyDeletedError", error);
      }
    },
  });

  if (policyId && !policy) {
    return <KeycloakSpinner />;
  }

  function getComponentType() {
    return isValidComponentType(policyType)
      ? COMPONENTS[policyType]
      : COMPONENTS["js"];
  }

  const ComponentType = getComponentType();

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={
          policyId ? policy?.name! : t("createPolicyOfType", { policyType })
        }
        dropdownItems={
          policyId
            ? [
                <DropdownItem
                  key="delete"
                  data-testid="delete-policy"
                  onClick={() => toggleDeleteDialog()}
                >
                  {t("delete")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          onSubmit={handleSubmit((policy) => onSubmitPolicy(policy))}
          role="anyone" // if you get this far it means you have access
        >
          <FormProvider {...form}>
            <NameDescription isDisabled={isDisabled} />
            <ComponentType />
            <LogicSelector isDisabled={isDisabled} />
          </FormProvider>
          <ActionGroup>
            <div className="pf-v5-u-mt-md">
              <Button
                isDisabled={isDisabled}
                variant={ButtonVariant.primary}
                className="pf-v5-u-mr-md"
                type="submit"
                data-testid="save"
              >
                {t("save")}
              </Button>

              <Button
                variant="link"
                data-testid="cancel"
                component={(props) => (
                  <Link
                    {...props}
                    to={
                      isAdminPermissionsClient
                        ? toPermissionsConfigurationTabs({
                            realm: realm!,
                            permissionClientId,
                            tab: "policies",
                          })
                        : toAuthorizationTab({
                            realm,
                            clientId: id,
                            tab: "policies",
                          })
                    }
                  />
                )}
              >
                {t("cancel")}
              </Button>
            </div>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/clients/$id/authorization/policy/new/$policyType")({
  component: PolicyDetails,
})
