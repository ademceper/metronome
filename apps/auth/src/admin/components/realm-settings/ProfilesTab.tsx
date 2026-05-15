/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/ProfilesTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";
import {
  Action,
  KeycloakDataTable,
  KeycloakSpinner,
  ListEmptyState,
  useAlerts,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { cn } from "@metronome/ui/lib/utils";
import { omit } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useConfirmDialog } from "../confirm-dialog/ConfirmDialog";
import CodeEditor from "../form/CodeEditor";
import { useRealm } from "../../context/realm-context/RealmContext";
import { prettyPrintJSON } from "../../util";
import { toAddClientProfile } from "../../lib/realm-settings";
import { toClientProfile } from "../../lib/realm-settings";

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
const Divider = (props: any) => <UISeparator {...props} />;
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
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
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

type ClientProfile = ClientProfileRepresentation & {
  global: boolean;
};

export default function ProfilesTab() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();
  const [tableProfiles, setTableProfiles] = useState<ClientProfile[]>();
  const [globalProfiles, setGlobalProfiles] =
    useState<ClientProfileRepresentation[]>();
  const [selectedProfile, setSelectedProfile] = useState<ClientProfile>();
  const [show, setShow] = useState(false);
  const [code, setCode] = useState<string>();
  const [key, setKey] = useState(0);

  useFetch(
    () =>
      adminClient.clientPolicies.listProfiles({
        includeGlobalProfiles: true,
      }),
    (allProfiles) => {
      setGlobalProfiles(allProfiles.globalProfiles);

      const globalProfiles = allProfiles.globalProfiles?.map(
        (globalProfiles) => ({
          ...globalProfiles,
          global: true,
        }),
      );

      const profiles = allProfiles.profiles?.map((profiles) => ({
        ...profiles,
        global: false,
      }));

      const allClientProfiles = globalProfiles?.concat(profiles ?? []);
      setTableProfiles(allClientProfiles || []);
      setCode(JSON.stringify(allClientProfiles, null, 2));
    },
    [key],
  );

  const loader = async () => tableProfiles ?? [];

  const normalizeProfile = (
    profile: ClientProfile,
  ): ClientProfileRepresentation => omit(profile, "global");

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteClientProfileConfirmTitle"),
    messageKey: t("deleteClientProfileConfirm", {
      profileName: selectedProfile?.name,
    }),
    continueButtonLabel: t("delete"),
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      const updatedProfiles = tableProfiles
        ?.filter(
          (profile) =>
            profile.name !== selectedProfile?.name && !profile.global,
        )
        .map<ClientProfileRepresentation>((profile) =>
          normalizeProfile(profile),
        );

      try {
        await adminClient.clientPolicies.createProfiles({
          profiles: updatedProfiles,
          globalProfiles,
        });
        addAlert(t("deleteClientSuccess"), AlertVariant.success);
        setKey(key + 1);
      } catch (error) {
        addError("deleteClientError", error);
      }
    },
  });

  const cellFormatter = (row: ClientProfile) => (
    <Link
      to={toClientProfile({
        realm,
        profileName: row.name!,
      })}
      key={row.name}
    >
      {row.name} {row.global && <Label color="blue">{t("global")}</Label>}
    </Link>
  );

  if (!tableProfiles) {
    return <KeycloakSpinner />;
  }

  const save = async () => {
    if (!code) {
      return;
    }

    try {
      const obj: ClientProfile[] = JSON.parse(code);
      const changedProfiles = obj
        .filter((profile) => !profile.global)
        .map((profile) => normalizeProfile(profile));

      const changedGlobalProfiles = obj
        .filter((profile) => profile.global)
        .map((profile) => normalizeProfile(profile));

      try {
        await adminClient.clientPolicies.createProfiles({
          profiles: changedProfiles,
          globalProfiles: changedGlobalProfiles,
        });
        addAlert(t("updateClientProfilesSuccess"), AlertVariant.success);
        setKey(key + 1);
      } catch (error) {
        addError("updateClientProfilesError", error);
      }
    } catch (error) {
      addError("invalidJsonClientProfilesError", error);
    }
  };

  return (
    <>
      <DeleteConfirm />
      <PageSection>
        <Flex className="kc-profiles-config-section">
          <FlexItem>
            <Title headingLevel="h1" size="md">
              {t("profilesConfigType")}
            </Title>
          </FlexItem>
          <FlexItem>
            <Radio
              isChecked={!show}
              name="profilesView"
              onChange={() => setShow(false)}
              label={t("profilesConfigTypes.formView")}
              id="formView-profilesView"
              className="kc-form-radio-btn pf-v5-u-mr-sm pf-v5-u-ml-sm"
              data-testid="formView-profilesView"
            />
          </FlexItem>
          <FlexItem>
            <Radio
              isChecked={show}
              name="profilesView"
              onChange={() => setShow(true)}
              label={t("profilesConfigTypes.jsonEditor")}
              id="jsonEditor-profilesView"
              className="kc-editor-radio-btn"
              data-testid="jsonEditor-profilesView"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <Divider />
      {!show ? (
        <KeycloakDataTable
          key={tableProfiles.length}
          ariaLabelKey="profiles"
          searchPlaceholderKey="clientProfileSearch"
          loader={loader}
          toolbarItem={
            <ToolbarItem>
              <Button
                id="createProfile"
                component={(props) => (
                  <Link
                    {...props}
                    to={toAddClientProfile({ realm, tab: "profiles" })}
                  />
                )}
                data-testid="createProfile"
              >
                {t("createClientProfile")}
              </Button>
            </ToolbarItem>
          }
          isRowDisabled={(value) => value.global}
          actions={[
            {
              title: t("delete"),
              onRowClick: (profile) => {
                setSelectedProfile(profile);
                toggleDeleteDialog();
              },
            } as Action<ClientProfile>,
          ]}
          columns={[
            {
              name: "name",
              displayKey: t("name"),
              cellRenderer: cellFormatter,
            },
            {
              name: "description",
              displayKey: t("clientProfileDescription"),
            },
          ]}
          emptyState={
            <ListEmptyState
              message={t("emptyClientProfiles")}
              instructions={t("emptyClientProfilesInstructions")}
            />
          }
        />
      ) : (
        <FormGroup fieldId={"jsonEditor"}>
          <div className="pf-v5-u-mt-md pf-v5-u-ml-lg">
            <CodeEditor
              value={code}
              language="json"
              onChange={(value) => setCode(value ?? "")}
              height={480}
            />
          </div>
          <ActionGroup>
            <div className="pf-v5-u-mt-md">
              <Button
                variant={ButtonVariant.primary}
                className="pf-v5-u-mr-md pf-v5-u-ml-lg"
                onClick={save}
                data-testid="jsonEditor-saveBtn"
              >
                {t("save")}
              </Button>
              <Button
                variant={ButtonVariant.link}
                onClick={() => {
                  setCode(prettyPrintJSON(tableProfiles));
                }}
                data-testid="jsonEditor-reloadBtn"
              >
                {t("reload")}
              </Button>
            </div>
          </ActionGroup>
        </FormGroup>
      )}
    </>
  );
}
