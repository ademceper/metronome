// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import { DecisionStrategy } from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import {
  FormErrorText,
  HelpItem,
  SelectVariant,
  TextAreaControl,
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../../../../admin-client";
import { useConfirmDialog } from "../../../../../../../../components/confirm-dialog/confirm-dialog";
import { FormAccess } from "../../../../../../../../components/form/form-access";
import { KeycloakSpinner } from "../../../../../../../../../shared/keycloak-ui-shared";
import { ViewHeader } from "../../../../../../../../components/view-header/view-header";
import { useAccess } from "../../../../../../../../context/access/access";
import { toUpperCase } from "../../../../../../../../util";
import { useParams } from "../../../../../../../../utils/use-params";
import { toAuthorizationTab } from "../../../../../../../../lib/clients";
import type { NewPermissionParams } from "../../../../../../../../lib/clients";
import {
  PermissionDetailsParams,
  toPermissionDetails,
} from "../../../../../../../../lib/clients";
import { ResourcesPolicySelect } from "../../../../../../../../components/clients/authorization/resources-policy-select";
import { ScopeSelect } from "../../../../../../../../components/clients/authorization/scope-select";

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

type FormFields = PolicyRepresentation & {
  resourceType: string;
};

function PermissionDetails() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();

  const form = useForm<FormFields>({
    mode: "onChange",
  });
  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = form;

  const navigate = useNavigate();
  const { id, realm, permissionType, permissionId, selectedId } = useParams<
    NewPermissionParams & PermissionDetailsParams
  >();

  const { addAlert, addError } = useAlerts();
  const [permission, setPermission] = useState<PolicyRepresentation>();
  const [applyToResourceTypeFlag, setApplyToResourceTypeFlag] = useState(false);
  const { hasAccess } = useAccess();

  const isDisabled = !hasAccess("manage-authorization");

  useFetch(
    async () => {
      if (!permissionId) {
        return {};
      }
      const [permission, resources, policies, scopes] = await Promise.all([
        adminClient.clients.findOnePermission({
          id,
          type: permissionType,
          permissionId,
        }),
        adminClient.clients.getAssociatedResources({
          id,
          permissionId,
        }),
        adminClient.clients.getAssociatedPolicies({
          id,
          permissionId,
        }),
        adminClient.clients.getAssociatedScopes({
          id,
          permissionId,
        }),
      ]);

      if (!permission) {
        throw new Error(t("notFound"));
      }

      return {
        permission,
        resources: resources.map((r) => r._id),
        policies: policies.map((p) => p.id!),
        scopes: scopes.map((s) => s.id!),
      };
    },
    ({ permission, resources, policies, scopes }) => {
      reset({ ...permission, resources, policies, scopes });
      if (permission && "resourceType" in permission) {
        setApplyToResourceTypeFlag(
          !!(permission as { resourceType: string }).resourceType,
        );
      }
      setPermission({ ...permission, resources, policies });
    },
    [],
  );

  const save = async (permission: PolicyRepresentation) => {
    try {
      if (permissionId) {
        await adminClient.clients.updatePermission(
          { id, type: permissionType, permissionId },
          permission,
        );
      } else {
        const result = await adminClient.clients.createPermission(
          { id, type: permissionType },
          permission,
        );
        setPermission(result);
        navigate(
          toPermissionDetails({
            realm,
            id,
            permissionType,
            permissionId: result.id!,
          }),
        );
      }
      addAlert(
        t((permissionId ? "update" : "create") + "PermissionSuccess"),
        AlertVariant.success,
      );
    } catch (error) {
      addError("permissionSaveError", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deletePermission",
    messageKey: t("deletePermissionConfirm", {
      permission: permission?.name,
    }),
    continueButtonVariant: ButtonVariant.danger,
    continueButtonLabel: "confirm",
    onConfirm: async () => {
      try {
        await adminClient.clients.delPermission({
          id,
          type: permissionType,
          permissionId: permissionId,
        });
        addAlert(t("permissionDeletedSuccess"), AlertVariant.success);
        navigate(
          toAuthorizationTab({ realm, clientId: id, tab: "permissions" }),
        );
      } catch (error) {
        addError("permissionDeletedError", error);
      }
    },
  });

  const resourcesIds = useWatch({
    control,
    name: "resources",
    defaultValue: [],
  });

  if (!permission) {
    return <KeycloakSpinner />;
  }

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={
          permissionId
            ? permission.name!
            : `create${toUpperCase(permissionType)}BasedPermission`
        }
        dropdownItems={
          permissionId
            ? [
                <DropdownItem
                  key="delete"
                  data-testid="delete-resource"
                  isDisabled={isDisabled}
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
          role="manage-authorization"
          onSubmit={handleSubmit(save)}
        >
          <FormProvider {...form}>
            <TextControl
              name="name"
              label={t("name")}
              labelIcon={t("permissionName")}
              rules={{
                required: t("required"),
              }}
            />
            <TextAreaControl
              name="description"
              label={t("description")}
              labelIcon={t("permissionDescription")}
              rules={{
                maxLength: {
                  value: 255,
                  message: t("maxLength", { length: 255 }),
                },
              }}
            />
            <FormGroup
              label={t("applyToResourceTypeFlag")}
              fieldId="applyToResourceTypeFlag"
              labelIcon={
                <HelpItem
                  helpText={t("applyToResourceTypeFlagHelp")}
                  fieldLabelId="applyToResourceTypeFlag"
                />
              }
            >
              <Switch
                id="applyToResourceTypeFlag"
                name="applyToResourceTypeFlag"
                label={t("on")}
                labelOff={t("off")}
                isChecked={applyToResourceTypeFlag}
                onChange={(_event, val) => setApplyToResourceTypeFlag(val)}
                aria-label={t("applyToResourceTypeFlag")}
              />
            </FormGroup>
            {applyToResourceTypeFlag ? (
              <TextControl
                name="resourceType"
                label={t("resourceType")}
                labelIcon={t("resourceTypeHelp")}
                rules={{
                  required: {
                    value: permissionType === "scope" ? true : false,
                    message: t("required"),
                  },
                }}
              />
            ) : (
              <FormGroup
                label={t("resource")}
                fieldId="resources"
                labelIcon={
                  <HelpItem
                    helpText={t("permissionResources")}
                    fieldLabelId="resources"
                  />
                }
                isRequired={permissionType !== "scope"}
              >
                <ResourcesPolicySelect
                  name="resources"
                  clientId={id}
                  permissionId={permissionId}
                  preSelected={
                    permissionType === "scope" ? undefined : selectedId
                  }
                  variant={
                    permissionType === "scope"
                      ? SelectVariant.typeahead
                      : SelectVariant.typeaheadMulti
                  }
                  isRequired={permissionType !== "scope"}
                />
                {errors.resources && <FormErrorText message={t("required")} />}
              </FormGroup>
            )}
            {permissionType === "scope" && (
              <FormGroup
                label={t("authorizationScopes")}
                fieldId="scopes"
                labelIcon={
                  <HelpItem
                    helpText={t("permissionScopesHelp")}
                    fieldLabelId="scopesSelect"
                  />
                }
                isRequired
              >
                <ScopeSelect
                  clientId={id}
                  resourceId={resourcesIds?.[0]}
                  preSelected={selectedId}
                />
                {errors.scopes && <FormErrorText message={t("required")} />}
              </FormGroup>
            )}
            <FormGroup
              label={t("policies")}
              fieldId="policies"
              labelIcon={
                <HelpItem
                  helpText={t("permissionPoliciesHelp")}
                  fieldLabelId="policies"
                />
              }
            >
              <ResourcesPolicySelect
                name="policies"
                clientId={id}
                permissionId={permissionId}
              />
            </FormGroup>
            <FormGroup
              label={t("decisionStrategy")}
              labelIcon={
                <HelpItem
                  helpText={t("permissionDecisionStrategyHelp")}
                  fieldLabelId="decisionStrategy"
                />
              }
              fieldId="policyEnforcementMode"
              hasNoPaddingTop
            >
              <Controller
                name="decisionStrategy"
                data-testid="decisionStrategy"
                defaultValue={DecisionStrategy.UNANIMOUS}
                control={control}
                render={({ field }) => (
                  <>
                    {Object.values(DecisionStrategy).map((strategy) => (
                      <Radio
                        id={strategy}
                        key={strategy}
                        data-testid={strategy}
                        isChecked={field.value === strategy}
                        isDisabled={isDisabled}
                        name="decisionStrategies"
                        onChange={() => field.onChange(strategy)}
                        label={t(`decisionStrategies.${strategy}`)}
                        className="pf-v5-u-mb-md"
                      />
                    ))}
                  </>
                )}
              />
            </FormGroup>
            <ActionGroup>
              <div className="pf-v5-u-mt-md">
                <Button
                  variant={ButtonVariant.primary}
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
                      to={toAuthorizationTab({
                        realm,
                        clientId: id,
                        tab: "permissions",
                      })}
                    ></Link>
                  )}
                >
                  {t("cancel")}
                </Button>
              </div>
            </ActionGroup>
          </FormProvider>
        </FormAccess>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/clients/$id/authorization/permission/new/$permissionType/$selectedId")({
  component: PermissionDetails,
})
