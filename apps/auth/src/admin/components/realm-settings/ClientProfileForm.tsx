/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/ClientProfileForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";
import type ClientProfilesRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfilesRepresentation";
import {
  HelpItem,
  TextAreaControl,
  TextControl,
  useAlerts,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { cn } from "@metronome/ui/lib/utils";
import { PlusCircle as PlusCircleIcon, Trash as TrashIcon } from "@phosphor-icons/react"
import { Fragment, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useConfirmDialog } from "../confirm-dialog/ConfirmDialog";
import { FormAccess } from "../form/FormAccess";
import { KeycloakSpinner } from "../../../shared/keycloak-ui-shared";
import { ViewHeader } from "../view-header/ViewHeader";
import { useServerInfo } from "../../context/server-info/server-info-provider";
import { useParams } from "../../utils/use-params";
import { toAddExecutor } from "../../lib/realm-settings";
import { toClientPolicies } from "../../lib/realm-settings";
import { ClientProfileParams, toClientProfile } from "../../lib/realm-settings";
import { toExecutor } from "../../lib/realm-settings";

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
const DataList = ({ children, className, ...props }: any) => (
  <div className={cn("divide-y rounded-md border", className)} {...props}>{children}</div>
);
const DataListCell = ({ children, className, ...props }: any) => (
  <div className={cn("flex-1", className)} {...props}>{children}</div>
);
const DataListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const DataListItemCells = ({ dataListCells, ...props }: any) => (
  <div className="flex flex-1 items-center gap-2" {...props}>{dataListCells}</div>
);
const DataListItemRow = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 px-3 py-2", className)} {...props}>{children}</div>
);
const Divider = (props: any) => <UISeparator {...props} />;
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;

type ClientProfileForm = Required<ClientProfileRepresentation>;

const defaultValues: ClientProfileForm = {
  name: "",
  description: "",
  executors: [],
};

export default function ClientProfileForm() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const form = useForm<ClientProfileForm>({
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    getValues,
    formState: { isDirty, isValid },
    control,
  } = form;

  const { fields: profileExecutors, remove } = useFieldArray({
    name: "executors",
    control,
  });

  const { addAlert, addError } = useAlerts();
  const [profiles, setProfiles] = useState<ClientProfilesRepresentation>();
  const [isGlobalProfile, setIsGlobalProfile] = useState(false);
  const { realm, profileName } = useParams<ClientProfileParams>();
  const serverInfo = useServerInfo();
  const executorTypes = useMemo(
    () =>
      serverInfo.componentTypes?.[
        "org.keycloak.services.clientpolicy.executor.ClientPolicyExecutorProvider"
      ],
    [],
  );
  const [executorToDelete, setExecutorToDelete] = useState<{
    idx: number;
    name: string;
  }>();
  const editMode = profileName ? true : false;
  const [key, setKey] = useState(0);
  const reload = () => setKey(key + 1);
  const setupForm = (profile?: ClientProfileRepresentation) => {
    form.reset({
      name: profile?.name ?? "",
      description: profile?.description ?? "",
      executors: profile?.executors ?? [],
    });
  };

  useFetch(
    () =>
      adminClient.clientPolicies.listProfiles({ includeGlobalProfiles: true }),
    (profiles) => {
      setProfiles({
        globalProfiles: profiles.globalProfiles,
        profiles: profiles.profiles?.filter((p) => p.name !== profileName),
      });
      const globalProfile = profiles.globalProfiles?.find(
        (p) => p.name === profileName,
      );
      const profile = profiles.profiles?.find((p) => p.name === profileName);
      setIsGlobalProfile(globalProfile !== undefined);
      const source = globalProfile ?? profile;
      setupForm(source);
    },
    [key],
  );

  const save = async (form: ClientProfileForm) => {
    const updatedProfiles = form;

    try {
      await adminClient.clientPolicies.createProfiles({
        ...profiles,
        profiles: [...(profiles?.profiles || []), updatedProfiles],
      });

      addAlert(
        editMode
          ? t("updateClientProfileSuccess")
          : t("createClientProfileSuccess"),
        AlertVariant.success,
      );

      navigate(toClientProfile({ realm, profileName: form.name }));
    } catch (error) {
      addError(
        editMode ? "updateClientProfileError" : "createClientProfileError",
        error,
      );
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: executorToDelete?.name!
      ? t("deleteExecutorProfileConfirmTitle")
      : t("deleteClientProfileConfirmTitle"),
    messageKey: executorToDelete?.name!
      ? t("deleteExecutorProfileConfirm", {
          executorName: executorToDelete.name!,
        })
      : t("deleteClientProfileConfirm", {
          profileName,
        }),
    continueButtonLabel: t("delete"),
    continueButtonVariant: ButtonVariant.danger,

    onConfirm: async () => {
      if (executorToDelete?.name!) {
        remove(executorToDelete.idx);
        try {
          await adminClient.clientPolicies.createProfiles({
            ...profiles,
            profiles: [...(profiles!.profiles || []), getValues()],
          });
          addAlert(t("deleteExecutorSuccess"), AlertVariant.success);
          navigate(toClientProfile({ realm, profileName }));
        } catch (error) {
          addError("deleteExecutorError", error);
        }
      } else {
        try {
          await adminClient.clientPolicies.createProfiles(profiles);
          addAlert(t("deleteClientSuccess"), AlertVariant.success);
          navigate(toClientPolicies({ realm, tab: "profiles" }));
        } catch (error) {
          addError("deleteClientError", error);
        }
      }
    },
  });

  if (!profiles) {
    return <KeycloakSpinner />;
  }

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={editMode ? profileName : t("newClientProfile")}
        badges={[
          {
            id: "global-client-profile-badge",
            text: isGlobalProfile ? (
              <Label color="blue">{t("global")}</Label>
            ) : (
              ""
            ),
          },
        ]}
        divider
        dropdownItems={
          editMode && !isGlobalProfile
            ? [
                <DropdownItem
                  key="delete"
                  value="delete"
                  onClick={toggleDeleteDialog}
                  data-testid="deleteClientProfileDropdown"
                >
                  {t("deleteClientProfile")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
      <PageSection variant="light">
        <FormProvider {...form}>
          <FormAccess isHorizontal role="view-realm" className="pf-v5-u-mt-lg">
            <TextControl
              name="name"
              label={t("newClientProfileName")}
              helperText={t("createClientProfileNameHelperText")}
              readOnly={isGlobalProfile}
              rules={{
                required: t("required"),
              }}
            />
            <TextAreaControl
              name="description"
              label={t("description")}
              readOnly={isGlobalProfile}
            />
            <ActionGroup>
              {!isGlobalProfile && (
                <Button
                  variant="primary"
                  onClick={() => handleSubmit(save)()}
                  data-testid="saveCreateProfile"
                  isDisabled={!isValid}
                >
                  {t("save")}
                </Button>
              )}
              {editMode && !isGlobalProfile && (
                <Button
                  id={"reloadProfile"}
                  variant="link"
                  data-testid={"reloadProfile"}
                  isDisabled={!isDirty}
                  onClick={reload}
                >
                  {t("reload")}
                </Button>
              )}
              {!editMode && !isGlobalProfile && (
                <Button
                  id={"cancelCreateProfile"}
                  variant="link"
                  component={(props) => (
                    <Link
                      {...props}
                      to={toClientPolicies({ realm, tab: "profiles" })}
                    />
                  )}
                  data-testid={"cancelCreateProfile"}
                >
                  {t("cancel")}
                </Button>
              )}
            </ActionGroup>
            {editMode && (
              <>
                <Flex>
                  <FlexItem>
                    <Text className="kc-executors" component={TextVariants.h1}>
                      {t("executors")}
                      <HelpItem
                        helpText={t("executorsHelpText")}
                        fieldLabelId="executors"
                      />
                    </Text>
                  </FlexItem>
                  {!isGlobalProfile && (
                    <FlexItem align={{ default: "alignRight" }}>
                      <Button
                        id="addExecutor"
                        component={(props) => (
                          <Link
                            {...props}
                            to={toAddExecutor({
                              realm,
                              profileName,
                            })}
                          />
                        )}
                        variant="link"
                        className="kc-addExecutor"
                        data-testid="addExecutor"
                        icon={<PlusCircleIcon />}
                      >
                        {t("addExecutor")}
                      </Button>
                    </FlexItem>
                  )}
                </Flex>
                {profileExecutors.length > 0 && (
                  <>
                    <DataList aria-label={t("executors")} isCompact>
                      {profileExecutors.map((executor, idx) => (
                        <DataListItem
                          aria-labelledby={"executors-list-item"}
                          key={executor.executor}
                          id={executor.executor}
                        >
                          <DataListItemRow data-testid="executors-list-row">
                            <DataListItemCells
                              dataListCells={[
                                <DataListCell
                                  key="executor"
                                  data-testid="executor-type"
                                >
                                  {executor.configuration ? (
                                    <Button
                                      component={(props) => (
                                        <Link
                                          {...props}
                                          to={toExecutor({
                                            realm,
                                            profileName,
                                            executorName: executor.executor!,
                                          })}
                                        />
                                      )}
                                      variant="link"
                                      data-testid="editExecutor"
                                    >
                                      {executor.executor}
                                    </Button>
                                  ) : (
                                    <span className="kc-unclickable-executor">
                                      {executor.executor}
                                    </span>
                                  )}
                                  {executorTypes
                                    ?.filter(
                                      (type) => type.id === executor.executor,
                                    )
                                    .map((type) => (
                                      <Fragment key={type.id}>
                                        <HelpItem
                                          key={type.id}
                                          helpText={type.helpText}
                                          fieldLabelId="executorTypeTextHelpText"
                                        />
                                        {!isGlobalProfile && (
                                          <Button
                                            data-testid={`deleteExecutor-${type.id}`}
                                            variant="link"
                                            isInline
                                            icon={
                                              <TrashIcon
                                                key={`executorType-trash-icon-${type.id}`}
                                                className="kc-executor-trash-icon"
                                              />
                                            }
                                            onClick={() => {
                                              toggleDeleteDialog();
                                              setExecutorToDelete({
                                                idx: idx,
                                                name: type.id,
                                              });
                                            }}
                                            aria-label={t("remove")}
                                          />
                                        )}
                                      </Fragment>
                                    ))}
                                </DataListCell>,
                              ]}
                            />
                          </DataListItemRow>
                        </DataListItem>
                      ))}
                    </DataList>
                    {isGlobalProfile && (
                      <Button
                        id="backToClientPolicies"
                        component={(props) => (
                          <Link
                            {...props}
                            to={toClientPolicies({ realm, tab: "profiles" })}
                          />
                        )}
                        variant="primary"
                        className="kc-backToPolicies"
                        data-testid="backToClientPolicies"
                      >
                        {t("back")}
                      </Button>
                    )}
                  </>
                )}
                {profileExecutors.length === 0 && (
                  <>
                    <Divider />
                    <Text
                      className="kc-emptyExecutors"
                      component={TextVariants.h2}
                    >
                      {t("emptyExecutors")}
                    </Text>
                  </>
                )}
              </>
            )}
          </FormAccess>
        </FormProvider>
      </PageSection>
    </>
  );
}
