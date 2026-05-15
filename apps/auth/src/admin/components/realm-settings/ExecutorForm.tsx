/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/ExecutorForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { ConfigPropertyRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigInfoRepresentation";
import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";
import type ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import {
  HelpItem,
  KeycloakSelect,
  SelectVariant,
  useAlerts,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { DynamicComponents } from "../dynamic/DynamicComponents";
import { FormAccess } from "../form/FormAccess";
import { ViewHeader } from "../view-header/ViewHeader";
import { useServerInfo } from "../../context/server-info/ServerInfoProvider";
import { useParams } from "../../utils/useParams";
import { ClientProfileParams, toClientProfile } from "../../lib/realm-settings";
import type { ExecutorParams } from "../../lib/realm-settings";
import { SelectOption } from "../../../shared/pf-compat"


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

type ExecutorForm = {
  config?: object;
  executor: string;
};

const defaultValues: ExecutorForm = {
  config: {},
  executor: "",
};

export default function ExecutorForm() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { realm, profileName } = useParams<ClientProfileParams>();
  const { executorName } = useParams<ExecutorParams>();
  const { addAlert, addError } = useAlerts();
  const [selectExecutorTypeOpen, setSelectExecutorTypeOpen] = useState(false);
  const serverInfo = useServerInfo();
  const executorTypes =
    serverInfo.componentTypes?.[
      "org.keycloak.services.clientpolicy.executor.ClientPolicyExecutorProvider"
    ];
  const [executors, setExecutors] = useState<ComponentTypeRepresentation[]>([]);
  const [executorProperties, setExecutorProperties] = useState<
    ConfigPropertyRepresentation[]
  >([]);
  const [globalProfiles, setGlobalProfiles] = useState<
    ClientProfileRepresentation[]
  >([]);
  const [profiles, setProfiles] = useState<ClientProfileRepresentation[]>([]);
  const form = useForm({ defaultValues });
  const { control, reset, handleSubmit } = form;
  const editMode = !!executorName;

  const setupForm = (profiles: ClientProfileRepresentation[]) => {
    const profile = profiles.find((profile) => profile.name === profileName);
    const executor = profile?.executors?.find(
      (executor) => executor.executor === executorName,
    );
    if (executor) reset({ config: executor.configuration });
  };

  useFetch(
    () =>
      adminClient.clientPolicies.listProfiles({ includeGlobalProfiles: true }),
    (profiles) => {
      setGlobalProfiles(profiles.globalProfiles!);
      setProfiles(profiles.profiles!);

      setupForm(profiles.profiles!);
      setupForm(profiles.globalProfiles!);
    },
    [],
  );

  const save = async () => {
    const formValues = form.getValues();
    const updatedProfiles = profiles.map((profile) => {
      if (profile.name !== profileName) {
        return profile;
      }

      const executors = (profile.executors ?? []).concat({
        executor: formValues.executor,
        configuration: formValues.config || {},
      });

      if (editMode) {
        const profileExecutor = profile.executors!.find(
          (executor) => executor.executor === executorName,
        );
        profileExecutor!.configuration = {
          ...profileExecutor!.configuration,
          ...formValues.config,
        };
      }

      if (editMode) {
        return profile;
      }
      return {
        ...profile,
        executors,
      };
    });
    try {
      await adminClient.clientPolicies.createProfiles({
        profiles: updatedProfiles,
        globalProfiles: globalProfiles,
      });
      addAlert(
        editMode ? t("updateExecutorSuccess") : t("addExecutorSuccess"),
        AlertVariant.success,
      );

      navigate(toClientProfile({ realm, profileName }));
    } catch (error) {
      addError(editMode ? "updateExecutorError" : "addExecutorError", error);
    }
  };

  const globalProfile = globalProfiles.find(
    (globalProfile) => globalProfile.name === profileName,
  );

  const profileExecutorType = executorTypes?.find(
    (executor) => executor.id === executorName,
  );

  const editedProfileExecutors =
    profileExecutorType?.properties.map<ConfigPropertyRepresentation>(
      (property) => {
        const globalDefaultValues = editMode ? property.defaultValue : "";
        return {
          ...property,
          defaultValue: globalDefaultValues,
        };
      },
    );

  return (
    <>
      <ViewHeader
        titleKey={editMode ? executorName : t("addExecutor")}
        divider
      />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          role="manage-realm"
          className="pf-v5-u-mt-lg"
          isReadOnly={!!globalProfile}
        >
          <FormGroup
            label={t("executorType")}
            fieldId="kc-executorType"
            labelIcon={
              executors.length > 0 && executors[0].helpText! !== "" ? (
                <HelpItem
                  helpText={executors[0].helpText}
                  fieldLabelId="executorTypeHelpText"
                />
              ) : editMode ? (
                <HelpItem
                  helpText={profileExecutorType?.helpText}
                  fieldLabelId="executorTypeHelpText"
                />
              ) : undefined
            }
          >
            <Controller
              name="executor"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <KeycloakSelect
                  toggleId="kc-executor"
                  placeholderText="Select an executor"
                  onToggle={(isOpen) => setSelectExecutorTypeOpen(isOpen)}
                  onSelect={(value) => {
                    reset({ ...defaultValues, executor: value.toString() });
                    const selectedExecutor = executorTypes?.filter(
                      (type) => type.id === value,
                    );
                    setExecutors(selectedExecutor ?? []);
                    setExecutorProperties(
                      selectedExecutor?.[0].properties ?? [],
                    );
                    setSelectExecutorTypeOpen(false);
                  }}
                  selections={editMode ? executorName : field.value}
                  variant={SelectVariant.single}
                  data-testid="executorType-select"
                  aria-label={t("executorType")}
                  isOpen={selectExecutorTypeOpen}
                  maxHeight={580}
                  isDisabled={editMode}
                >
                  {executorTypes?.map((option) => (
                    <SelectOption
                      data-testid={option.id}
                      selected={option.id === field.value}
                      key={option.id}
                      value={option.id}
                      description={option.helpText}
                    >
                      {option.id}
                    </SelectOption>
                  ))}
                </KeycloakSelect>
              )}
            />
          </FormGroup>
          <FormProvider {...form}>
            <DynamicComponents
              properties={
                editMode ? editedProfileExecutors! : executorProperties
              }
            />
          </FormProvider>
          {!globalProfile && (
            <ActionGroup>
              <Button
                variant="primary"
                onClick={() => handleSubmit(save)()}
                data-testid="addExecutor-saveBtn"
              >
                {editMode ? t("save") : t("add")}
              </Button>
              <Button
                variant="link"
                component={(props) => (
                  <Link
                    {...props}
                    to={toClientProfile({ realm, profileName })}
                  />
                )}
                data-testid="addExecutor-cancelBtn"
              >
                {t("cancel")}
              </Button>
            </ActionGroup>
          )}
        </FormAccess>
        {editMode && globalProfile && (
          <div className="kc-backToProfile">
            <Button
              component={(props) => (
                <Link {...props} to={toClientProfile({ realm, profileName })} />
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
