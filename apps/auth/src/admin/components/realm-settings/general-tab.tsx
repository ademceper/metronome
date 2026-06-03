/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/GeneralTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import {
  UnmanagedAttributePolicy,
  UserProfileConfig,
} from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import {
  FormErrorText,
  HelpItem,
  KeycloakSpinner,
  SelectControl,
  TextControl,
  useEnvironment,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { DefaultSwitchControl } from "../switch-control";
import { FormattedLink } from "../external-link/formatted-link";
import { FixedButtonsGroup } from "../form/fixed-button-group";
import { FormAccess } from "../form/form-access";
import { RealmLoAMapping } from "../realm-loa-mapping/realm-lo-a-mapping";
import { useRealm } from "../../context/realm-context/realm-context";
import {
  addTrailingSlash,
  convertAttributeNameToForm,
  convertToFormValues,
} from "../../util";
import useIsFeatureEnabled, { Feature } from "../../utils/use-is-feature-enabled";
import { UIRealmRepresentation } from "./realm-settings-tabs";
import { SIGNATURE_ALGORITHMS } from "../clients/add/saml-signature";
import type { RealmLoAMappingType } from "../realm-loa-mapping/realm-lo-a-mapping";


const ClipboardCopy = ({ value, onChange, isReadOnly, isCode, hoverTip, clickTip, children, variant, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);
  const text = value ?? children ?? "";
  return (
    <div className="flex items-stretch gap-0">
      <UIInput readOnly={isReadOnly} value={String(text)}
        onChange={(e: any) => onChange?.(e, e.target.value)} className="rounded-r-none" />
      <UIButton type="button" variant="outline" className="rounded-l-none"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(String(text));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}>
        {copied ? (clickTip ?? "Copied") : (hoverTip ?? "Copy")}
      </UIButton>
    </div>
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
const Stack = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const StackItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

type RealmSettingsGeneralTabProps = {
  realm: UIRealmRepresentation;
  save: (realm: UIRealmRepresentation) => Promise<void>;
};

export const RealmSettingsGeneralTab = ({
  realm,
  save,
}: RealmSettingsGeneralTabProps) => {
  const { adminClient } = useAdminClient();

  const { realm: realmName } = useRealm();
  const [userProfileConfig, setUserProfileConfig] =
    useState<UserProfileConfig>();

  useFetch(
    () => adminClient.users.getProfile({ realm: realmName }),
    (config) => setUserProfileConfig(config),
    [],
  );

  if (!userProfileConfig) {
    return <KeycloakSpinner />;
  }

  return (
    <RealmSettingsGeneralTabForm
      realm={realm}
      save={save}
      userProfileConfig={userProfileConfig}
    />
  );
};

type RealmSettingsGeneralTabFormProps = {
  realm: UIRealmRepresentation;
  save: (realm: UIRealmRepresentation) => Promise<void>;
  userProfileConfig: UserProfileConfig;
};

type FormFields = Omit<RealmRepresentation, "groups"> & {
  unmanagedAttributePolicy: UnmanagedAttributePolicy;
};

const REQUIRE_SSL_TYPES = ["all", "external", "none"];

const UNMANAGED_ATTRIBUTE_POLICIES = [
  UnmanagedAttributePolicy.Disabled,
  UnmanagedAttributePolicy.Enabled,
  UnmanagedAttributePolicy.AdminView,
  UnmanagedAttributePolicy.AdminEdit,
];

function RealmSettingsGeneralTabForm({
  realm,
  save,
  userProfileConfig,
}: RealmSettingsGeneralTabFormProps) {
  const {
    environment: { serverBaseUrl },
  } = useEnvironment();

  const { t } = useTranslation();
  const { realm: realmName } = useRealm();
  const form = useForm<FormFields>();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;
  const isFeatureEnabled = useIsFeatureEnabled();
  const isOrganizationsEnabled = isFeatureEnabled(Feature.Organizations);
  const isAdminPermissionsV2Enabled = isFeatureEnabled(
    Feature.AdminFineGrainedAuthzV2,
  );
  const isOpenid4vciEnabled = isFeatureEnabled(Feature.OpenId4VCI);
  const isStepUpAuthenticationSaml = isFeatureEnabled(
    Feature.StepUpAuthenticationSaml,
  );
  const isScimApiEnabled = isFeatureEnabled(Feature.ScimApi);

  const setupForm = () => {
    convertToFormValues(realm, setValue);
    setValue(
      "unmanagedAttributePolicy",
      userProfileConfig.unmanagedAttributePolicy ||
        UNMANAGED_ATTRIBUTE_POLICIES[0],
    );
    if (realm.attributes?.["acr.loa.map"]) {
      const acrLoaMap = Object.entries(
        JSON.parse(realm.attributes["acr.loa.map"]),
      ).flatMap(([acr, loa]) => ({ acr, loa }) as RealmLoAMappingType);

      if (isStepUpAuthenticationSaml && realm.attributes?.["acr.uri.map"]) {
        const acrUriMap = JSON.parse(realm.attributes["acr.uri.map"]);
        acrLoaMap.forEach((row) => (row.uri = acrUriMap?.[row?.acr]));
      }

      setValue(
        convertAttributeNameToForm("attributes.acr.loa.map") as any,
        acrLoaMap,
      );
    }
  };

  useEffect(setupForm, []);

  const onSubmit = handleSubmit(
    async ({ unmanagedAttributePolicy, ...data }) => {
      const upConfig = { ...userProfileConfig };

      if (unmanagedAttributePolicy === UnmanagedAttributePolicy.Disabled) {
        delete upConfig.unmanagedAttributePolicy;
      } else {
        upConfig.unmanagedAttributePolicy = unmanagedAttributePolicy;
      }

      await save({ ...data, upConfig });
    },
  );

  return (
    <PageSection variant="light">
      <FormProvider {...form}>
        <FormAccess
          isHorizontal
          role="manage-realm"
          className="pf-u-mt-lg"
          onSubmit={onSubmit}
        >
          <FormGroup label={t("realmName")} fieldId="kc-realm-id" isRequired>
            <Controller
              name="realm"
              control={control}
              rules={{
                required: { value: true, message: t("required") },
              }}
              defaultValue=""
              render={({ field }) => (
                <ClipboardCopy
                  data-testid="realmName"
                  onChange={field.onChange}
                >
                  {field.value}
                </ClipboardCopy>
              )}
            />
            {errors.realm && (
              <FormErrorText
                data-testid="realm-id-error"
                message={errors.realm.message as string}
              />
            )}
          </FormGroup>
          <TextControl name="displayName" label={t("displayName")} />
          <TextControl name="displayNameHtml" label={t("htmlDisplayName")} />
          <TextControl
            name={convertAttributeNameToForm("attributes.frontendUrl")}
            type="url"
            label={t("frontendUrl")}
            labelIcon={t("frontendUrlHelp")}
          />
          <SelectControl
            name="sslRequired"
            label={t("requireSsl")}
            labelIcon={t("requireSslHelp")}
            controller={{
              defaultValue: "none",
            }}
            options={REQUIRE_SSL_TYPES.map((sslType) => ({
              key: sslType,
              value: t(`sslType.${sslType}`),
            }))}
          />
          <FormGroup
            label={t("acrToLoAMapping")}
            fieldId="acrToLoAMapping"
            labelIcon={
              <HelpItem
                helpText={
                  isStepUpAuthenticationSaml
                    ? t("acrToLoAMappingRealmSamlHelp")
                    : t("acrToLoAMappingHelp")
                }
                fieldLabelId="acrToLoAMapping"
              />
            }
          >
            <RealmLoAMapping
              label={t("acrToLoAMapping")}
              name={convertAttributeNameToForm("attributes.acr.loa.map")}
              uri={isStepUpAuthenticationSaml}
            />
          </FormGroup>
          <DefaultSwitchControl
            name="userManagedAccessAllowed"
            label={t("userManagedAccess")}
            labelIcon={t("userManagedAccessHelp")}
          />
          {isOrganizationsEnabled && (
            <DefaultSwitchControl
              name="organizationsEnabled"
              label={t("organizationsEnabled")}
              labelIcon={t("organizationsEnabledHelp")}
            />
          )}
          {isAdminPermissionsV2Enabled && (
            <DefaultSwitchControl
              name="adminPermissionsEnabled"
              label={t("adminPermissionsEnabled")}
              labelIcon={t("adminPermissionsEnabledHelp")}
            />
          )}
          {isOpenid4vciEnabled && (
            <DefaultSwitchControl
              name="verifiableCredentialsEnabled"
              label={t("verifiableCredentialsEnabled")}
              labelIcon={t("verifiableCredentialsEnabledHelp")}
            />
          )}
          {isScimApiEnabled && (
            <DefaultSwitchControl
              name="scimApiEnabled"
              label={t("scimApiEnabled")}
              labelIcon={t("scimApiEnabledHelp")}
            />
          )}
          <SelectControl
            name="unmanagedAttributePolicy"
            label={t("unmanagedAttributes")}
            labelIcon={t("unmanagedAttributesHelpText")}
            controller={{
              defaultValue: UNMANAGED_ATTRIBUTE_POLICIES[0],
            }}
            options={UNMANAGED_ATTRIBUTE_POLICIES.map((policy) => ({
              key: policy,
              value: t(`unmanagedAttributePolicy.${policy}`),
            }))}
          />
          <SelectControl
            name={convertAttributeNameToForm<FormFields>(
              "attributes.saml.signature.algorithm",
            )}
            label={t("signatureAlgorithmIdentityProviderMetadata")}
            labelIcon={t("signatureAlgorithmIdentityProviderMetadataHelp")}
            controller={{
              defaultValue: "",
            }}
            options={[
              { key: "", value: t("choose") },
              ...SIGNATURE_ALGORITHMS.map((v) => ({ key: v, value: v })),
            ]}
          />
          <FormGroup
            label={t("endpoints")}
            labelIcon={
              <HelpItem
                helpText={t("endpointsHelp")}
                fieldLabelId="endpoints"
              />
            }
            fieldId="kc-endpoints"
          >
            <Stack>
              <StackItem>
                <FormattedLink
                  href={`${addTrailingSlash(
                    serverBaseUrl,
                  )}realms/${realmName}/.well-known/openid-configuration`}
                  title={t("openIDEndpointConfiguration")}
                />
              </StackItem>
              <StackItem>
                <FormattedLink
                  href={`${addTrailingSlash(
                    serverBaseUrl,
                  )}realms/${realmName}/protocol/saml/descriptor`}
                  title={t("samlIdentityProviderMetadata")}
                />
              </StackItem>
              {isOpenid4vciEnabled && realm.verifiableCredentialsEnabled && (
                <StackItem>
                  <FormattedLink
                    href={`${addTrailingSlash(
                      serverBaseUrl,
                    )}.well-known/openid-credential-issuer/realms/${realmName}`}
                    title={t("oid4vcIssuerMetadata")}
                  />
                </StackItem>
              )}
              {isScimApiEnabled && realm.scimApiEnabled && (
                <StackItem>
                  <FormattedLink
                    href={`${addTrailingSlash(
                      serverBaseUrl,
                    )}realms/${realmName}/scim/v2`}
                    title={t("SCIM Endpoint")}
                  />
                </StackItem>
              )}
            </Stack>
          </FormGroup>
          <FixedButtonsGroup
            name="realmSettingsGeneralTab"
            reset={setupForm}
            isSubmit
          />
        </FormAccess>
      </FormProvider>
    </PageSection>
  );
}
