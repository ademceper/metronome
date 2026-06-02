// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type { ConfigPropertyRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigInfoRepresentation";
import type ClientPolicyConditionRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientPolicyConditionRepresentation";
import type ClientPolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientPolicyRepresentation";
import type ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import {
  HelpItem,
  KeycloakSelect,
  SelectVariant,
  useAlerts,
  useFetch,
} from "../../../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAdminClient } from "../../../../../../admin-client";
import { DynamicComponents } from "../../../../../../components/dynamic/DynamicComponents";
import { FormAccess } from "../../../../../../components/form/FormAccess";
import { ViewHeader } from "../../../../../../components/view-header/ViewHeader";
import { useRealm } from "../../../../../../context/realm-context/realm-context";
import { useServerInfo } from "../../../../../../context/server-info/server-info-provider";
import { toEditClientPolicy } from "../../../../../../lib/realm-settings";
import type { EditClientPolicyConditionParams } from "../../../../../../lib/realm-settings";
import { SelectOption } from "../../../../../../../shared/pf-compat"


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

export type ItemType = { value: string };

type ConfigProperty = ConfigPropertyRepresentation & {
  conditions: any;
  config: any;
};

function NewClientPolicyCondition() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const navigate = useNavigate();
  const { realm } = useRealm();

  const [openConditionType, setOpenConditionType] = useState(false);
  const [isGlobalPolicy, setIsGlobalPolicy] = useState(false);
  const [policies, setPolicies] = useState<ClientPolicyRepresentation[]>([]);

  const [conditionData, setConditionData] =
    useState<ClientPolicyConditionRepresentation>();
  const [conditionType, setConditionType] = useState("");
  const [condition, setCondition] = useState<ComponentTypeRepresentation>();

  const { policyName, conditionName } =
    useParams<EditClientPolicyConditionParams>();

  const serverInfo = useServerInfo();
  const form = useForm<ConfigProperty>();

  const conditionTypes =
    serverInfo.componentTypes?.[
      "org.keycloak.services.clientpolicy.condition.ClientPolicyConditionProvider"
    ];

  const setupForm = (condition: ClientPolicyConditionRepresentation) => {
    form.reset({ config: condition.configuration || {} });
  };

  useFetch(
    () =>
      adminClient.clientPolicies.listPolicies({
        includeGlobalPolicies: true,
      }),

    (policies) => {
      setPolicies(policies.policies ?? []);

      if (conditionName) {
        let currentPolicy = policies.policies?.find(
          (item) => item.name === policyName,
        );
        if (currentPolicy === undefined) {
          currentPolicy = policies.globalPolicies?.find(
            (item) => item.name === policyName,
          );
          setIsGlobalPolicy(currentPolicy !== undefined);
        }

        const typeAndConfigData = currentPolicy?.conditions?.find(
          (item) => item.condition === conditionName,
        );

        const currentCondition = conditionTypes?.find(
          (condition) => condition.id === conditionName,
        );

        setConditionData(typeAndConfigData!);
        setCondition(currentCondition);
        setupForm(typeAndConfigData!);
      }
    },
    [],
  );

  const save = async (configPolicy: ConfigProperty) => {
    const configValues = configPolicy.config;

    const writeConfig = () => {
      return condition?.properties.reduce((r: any, p) => {
        r[p.name!] = configValues[p.name!];
        return r;
      }, {});
    };

    const updatedPolicies = policies.map((policy) => {
      if (policy.name !== policyName) {
        return policy;
      }

      let conditions = policy.conditions ?? [];

      if (conditionName) {
        const createdCondition = {
          condition: conditionData?.condition,
          configuration: writeConfig(),
        };

        const index = conditions.findIndex(
          (condition) => conditionName === condition.condition,
        );

        if (index === -1) {
          return;
        }

        const newConditions = [
          ...conditions.slice(0, index),
          createdCondition,
          ...conditions.slice(index + 1),
        ];

        return {
          ...policy,
          conditions: newConditions,
        };
      }

      conditions = conditions.concat({
        condition: condition!.id,
        configuration: writeConfig(),
      });

      return {
        ...policy,
        conditions,
      };
    }) as ClientPolicyRepresentation[];

    try {
      await adminClient.clientPolicies.updatePolicy({
        policies: updatedPolicies,
      });
      setPolicies(updatedPolicies);
      navigate(toEditClientPolicy({ realm, policyName: policyName! }));
      addAlert(
        conditionName
          ? t("updateClientConditionSuccess")
          : t("createClientConditionSuccess"),
        AlertVariant.success,
      );
    } catch (error) {
      addError("createClientConditionError", error);
    }
  };

  return (
    <>
      <ViewHeader
        titleKey={
          conditionName
            ? isGlobalPolicy
              ? t("viewCondition")
              : t("editCondition")
            : t("addCondition")
        }
        divider
      />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          role="manage-realm"
          isReadOnly={isGlobalPolicy}
          className="pf-v5-u-mt-lg"
          onSubmit={form.handleSubmit(save)}
        >
          <FormGroup
            label={t("conditionType")}
            fieldId="conditionType"
            labelIcon={
              <HelpItem
                helpText={condition?.helpText || t("conditionsHelp")}
                fieldLabelId="conditionType"
              />
            }
          >
            <Controller
              name="conditions"
              defaultValue={"any-client"}
              control={form.control}
              render={({ field }) => (
                <KeycloakSelect
                  placeholderText={t("selectACondition")}
                  className="kc-conditionType-select"
                  data-testid="conditionType-select"
                  toggleId="provider"
                  isDisabled={!!conditionName}
                  onToggle={(toggle) => setOpenConditionType(toggle)}
                  onSelect={(value) => {
                    field.onChange(value);
                    setCondition(value as ComponentTypeRepresentation);
                    setConditionType((value as ComponentTypeRepresentation).id);
                    setOpenConditionType(false);
                  }}
                  selections={conditionName ? conditionName : conditionType}
                  variant={SelectVariant.single}
                  aria-label={t("conditionType")}
                  isOpen={openConditionType}
                  width="trigger"
                >
                  {conditionTypes?.map((condition) => (
                    <SelectOption
                      data-testid={condition.id}
                      selected={condition.id === field.value}
                      description={condition?.helpText}
                      key={condition.id}
                      value={condition}
                    >
                      {condition.id}
                    </SelectOption>
                  ))}
                </KeycloakSelect>
              )}
            />
          </FormGroup>

          <FormProvider {...form}>
            <DynamicComponents properties={condition?.properties || []} />
          </FormProvider>
          {!isGlobalPolicy && (
            <ActionGroup>
              <Button
                variant="primary"
                type="submit"
                data-testid="addCondition-saveBtn"
                isDisabled={
                  conditionType === "" && !conditionName && isGlobalPolicy
                }
              >
                {conditionName ? t("save") : t("add")}
              </Button>
              <Button
                variant="link"
                data-testid="addCondition-cancelBtn"
                onClick={() =>
                  navigate(
                    toEditClientPolicy({ realm, policyName: policyName! }),
                  )
                }
              >
                {t("cancel")}
              </Button>
            </ActionGroup>
          )}
        </FormAccess>
        {isGlobalPolicy && (
          <div className="kc-backToProfile">
            <Button
              component={(props) => (
                <Link
                  {...props}
                  to={toEditClientPolicy({ realm, policyName: policyName! })}
                />
              )}
              variant="primary"
            >
              {t("back")}
            </Button>
          </div>
        )}
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/realm-settings/client-policies/$policyName/edit-policy/create-condition")({
  component: NewClientPolicyCondition,
})
