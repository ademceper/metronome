// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react";
import type IdentityProviderMapperRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderMapperRepresentation";
import IdentityProviderRepresentation, {
  IdentityProviderType,
} from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import { KeycloakSpinner, ScrollForm, useAlerts, useFetch } from "../../../../../../../shared/keycloak-ui-shared";
import { Action, DataTable } from "@metronome/ui/components/table/data-table";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../../admin-client";
import { useConfirmDialog } from "../../../../../../components/confirm-dialog/ConfirmDialog";
import { DynamicComponents } from "../../../../../../components/dynamic/DynamicComponents";
import { FixedButtonsGroup } from "../../../../../../components/form/FixedButtonGroup";
import { FormAccess } from "../../../../../../components/form/FormAccess";
import { PermissionsTab } from "../../../../../../components/permission-tab/PermissionTab";
import {
  RoutableTabs,
  useRoutableTab,
} from "../../../../../../components/routable-tabs/RoutableTabs";
import { ViewHeader } from "../../../../../../components/view-header/ViewHeader";
import { useAccess } from "../../../../../../context/access/access";
import { useRealm } from "../../../../../../context/realm-context/realm-context";
import { useServerInfo } from "../../../../../../context/server-info/server-info-provider";
import { toUpperCase } from "../../../../../../util";
import useIsFeatureEnabled, { Feature } from "../../../../../../utils/use-is-feature-enabled";
import { useParams } from "../../../../../../utils/use-params";
import { toIdentityProviderAddMapper } from "../../../../../../lib/identity-providers";
import { toIdentityProviderEditMapper } from "../../../../../../lib/identity-providers";
import {
  IdentityProviderParams,
  IdentityProviderTab,
  toIdentityProvider,
} from "../../../../../../lib/identity-providers";
import { toIdentityProviders } from "../../../../../../lib/identity-providers";
import { AdvancedSettings } from "../../../../../../components/identity-providers/add/AdvancedSettings";
import { DescriptorSettings } from "../../../../../../components/identity-providers/add/DescriptorSettings";
import { DiscoverySettings } from "../../../../../../components/identity-providers/add/DiscoverySettings";
import { ExtendedNonDiscoverySettings } from "../../../../../../components/identity-providers/add/ExtendedNonDiscoverySettings";
import { ExtendedOAuth2Settings } from "../../../../../../components/identity-providers/add/ExtendedOAuth2Settings";
import { GeneralSettings } from "../../../../../../components/identity-providers/add/GeneralSettings";
import { OIDCAuthentication } from "../../../../../../components/identity-providers/add/OIDCAuthentication";
import { OIDCGeneralSettings } from "../../../../../../components/identity-providers/add/OIDCGeneralSettings";
import { ReqAuthnConstraints } from "../../../../../../components/identity-providers/add/ReqAuthnConstraintsSettings";
import { SamlGeneralSettings } from "../../../../../../components/identity-providers/add/SamlGeneralSettings";
import { SpiffeSettings } from "../../../../../../components/identity-providers/add/SpiffeSettings";
import { AdminEvents } from "../../../../../../components/events/AdminEvents";
import { UserProfileClaimsSettings } from "../../../../../../components/identity-providers/add/OAuth2UserProfileClaimsSettings";
import { KubernetesSettings } from "../../../../../../components/identity-providers/add/KubernetesSettings";
import { JWTAuthorizationGrantAssertionSettings } from "../../../../../../components/identity-providers/add/JWTAuthorizationGrantAssertionSettings";
import JWTAuthorizationGrantSettings from "../../../../../../components/identity-providers/add/JWTAuthorizationGrantSettings";
import { DefaultSwitchControl } from "../../../../../../components/SwitchControl";
import { GroupResourceContext } from "../../../../../../context/group-resource/group-resource-context";
import { Tab, TabTitleText } from "../../../../../../../shared/pf-compat"


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
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
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
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

type HeaderProps = {
  onChange: (value: boolean) => void;
  value: boolean;
  save: () => void;
  toggleDeleteDialog: () => void;
};

type IdPWithMapperAttributes = IdentityProviderMapperRepresentation & {
  name: string;
  category?: string;
  helpText?: string;
  type: string;
  mapperId: string;
};

const Header = ({ onChange, value, save, toggleDeleteDialog }: HeaderProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { alias: displayName } = useParams<{ alias: string }>();
  const [provider, setProvider] = useState<IdentityProviderRepresentation>();
  const { addAlert, addError } = useAlerts();
  const { setValue, formState, control } = useFormContext();

  const validateSignature = useWatch({
    control,
    name: "config.validateSignature",
  });

  const useMetadataDescriptorUrl = useWatch({
    control,
    name: "config.useMetadataDescriptorUrl",
  });

  const metadataDescriptorUrl = useWatch({
    control,
    name: "config.metadataDescriptorUrl",
  });

  useFetch(
    () => adminClient.identityProviders.findOne({ alias: displayName }),
    (fetchedProvider) => {
      if (!fetchedProvider) {
        throw new Error(t("notFound"));
      }
      setProvider(fetchedProvider);
    },
    [],
  );

  const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
    titleKey: "disableProvider",
    messageKey: t("disableConfirmIdentityProvider", { provider: displayName }),
    continueButtonLabel: "disable",
    onConfirm: () => {
      onChange(!value);
      save();
    },
  });

  const importSamlKeys = async (
    providerId: string,
    metadataDescriptorUrl: string,
  ) => {
    try {
      const result = await adminClient.identityProviders.importFromUrl({
        providerId: providerId,
        fromUrl: metadataDescriptorUrl,
      });
      if (result.signingCertificate) {
        setValue(`config.signingCertificate`, result.signingCertificate);
        addAlert(t("importKeysSuccess"), AlertVariant.success);
      } else {
        addError("importKeysError", t("importKeysErrorNoSigningCertificate"));
      }
    } catch (error) {
      addError("importKeysError", error);
    }
  };

  const reloadSamlKeys = async (alias: string) => {
    try {
      const result = await adminClient.identityProviders.reloadKeys({
        alias: alias,
      });
      if (result) {
        addAlert(t("reloadKeysSuccess"), AlertVariant.success);
      } else {
        addAlert(t("reloadKeysSuccessButFalse"), AlertVariant.warning);
      }
    } catch (error) {
      addError("reloadKeysError", error);
    }
  };

  return (
    <>
      <DisableConfirm />
      <ViewHeader
        titleKey={toUpperCase(
          provider
            ? provider.displayName
              ? provider.displayName
              : provider.providerId!
            : "",
        )}
        divider={false}
        dropdownItems={[
          ...(provider?.providerId?.includes("saml") &&
          validateSignature === "true" &&
          useMetadataDescriptorUrl === "true" &&
          metadataDescriptorUrl &&
          !formState.isDirty &&
          value
            ? [
                <DropdownItem
                  key="reloadKeys"
                  onClick={() => reloadSamlKeys(provider.alias!)}
                >
                  {t("reloadKeys")}
                </DropdownItem>,
              ]
            : provider?.providerId?.includes("saml") &&
                validateSignature === "true" &&
                useMetadataDescriptorUrl !== "true" &&
                metadataDescriptorUrl &&
                !formState.isDirty
              ? [
                  <DropdownItem
                    key="importKeys"
                    onClick={() =>
                      importSamlKeys(
                        provider.providerId!,
                        metadataDescriptorUrl,
                      )
                    }
                  >
                    {t("importKeys")}
                  </DropdownItem>,
                ]
              : []),
          <Divider key="separator" />,
          <DropdownItem key="delete" onClick={() => toggleDeleteDialog()}>
            {t("delete")}
          </DropdownItem>,
        ]}
        isEnabled={value}
        onToggle={(value) => {
          if (!value) {
            toggleDisableDialog();
          } else {
            onChange(value);
            save();
          }
        }}
      />
    </>
  );
};

type MapperLinkProps = IdPWithMapperAttributes & {
  provider?: IdentityProviderRepresentation;
};

const MapperLink = ({ name, mapperId, provider }: MapperLinkProps) => {
  const { realm } = useRealm();
  const { alias } = useParams<IdentityProviderParams>();

  return (
    <Link
      to={toIdentityProviderEditMapper({
        realm,
        alias,
        providerId: provider?.providerId!,
        id: mapperId,
      })}
    >
      {name}
    </Link>
  );
};

function DetailSettings() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { alias, providerId } = useParams<IdentityProviderParams>();
  const isFeatureEnabled = useIsFeatureEnabled();
  const form = useForm<IdentityProviderRepresentation>();
  const { handleSubmit, getValues, reset, control } = form;
  const [provider, setProvider] = useState<IdentityProviderRepresentation>();
  const [selectedMapper, setSelectedMapper] =
    useState<IdPWithMapperAttributes>();
  const serverInfo = useServerInfo();
  const providerInfo = useMemo(() => {
    const namespaces = [
      "org.keycloak.broker.social.SocialIdentityProvider",
      "org.keycloak.broker.provider.IdentityProvider",
    ];

    for (const namespace of namespaces) {
      const social = serverInfo.componentTypes?.[namespace]?.find(
        ({ id }) => id === providerId,
      );

      if (social) {
        return social;
      }
    }
  }, [serverInfo, providerId]);

  const { addAlert, addError } = useAlerts();
  const navigate = useNavigate();
  const { realm, realmRepresentation } = useRealm();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const { hasAccess } = useAccess();

  useFetch(
    () => adminClient.identityProviders.findOne({ alias }),
    (fetchedProvider) => {
      if (!fetchedProvider) {
        throw new Error(t("notFound"));
      }

      reset(fetchedProvider);
      setProvider(fetchedProvider);

      if (fetchedProvider.config!.authnContextClassRefs) {
        form.setValue(
          "config.authnContextClassRefs",
          JSON.parse(fetchedProvider.config?.authnContextClassRefs),
        );
      }

      if (fetchedProvider.config!.authnContextDeclRefs) {
        form.setValue(
          "config.authnContextDeclRefs",
          JSON.parse(fetchedProvider.config?.authnContextDeclRefs),
        );
      }
    },
    [],
  );

  const toTab = (tab: IdentityProviderTab) =>
    toIdentityProvider({
      realm,
      alias,
      providerId,
      tab,
    });

  const useTab = (tab: IdentityProviderTab) => useRoutableTab(toTab(tab));

  const settingsTab = useTab("settings");
  const mappersTab = useTab("mappers");
  const permissionsTab = useTab("permissions");
  const eventsTab = useTab("events");

  const save = async (savedProvider?: IdentityProviderRepresentation) => {
    const p = savedProvider || getValues();
    const origAuthnContextClassRefs = p.config?.authnContextClassRefs;
    if (p.config?.authnContextClassRefs)
      p.config.authnContextClassRefs = JSON.stringify(
        p.config.authnContextClassRefs,
      );
    const origAuthnContextDeclRefs = p.config?.authnContextDeclRefs;
    if (p.config?.authnContextDeclRefs)
      p.config.authnContextDeclRefs = JSON.stringify(
        p.config.authnContextDeclRefs,
      );

    try {
      await adminClient.identityProviders.update(
        { alias },
        {
          ...p,
          config: { ...provider?.config, ...p.config },
          alias,
          providerId,
        },
      );
      if (origAuthnContextClassRefs) {
        p.config!.authnContextClassRefs = origAuthnContextClassRefs;
      }
      if (origAuthnContextDeclRefs) {
        p.config!.authnContextDeclRefs = origAuthnContextDeclRefs;
      }
      reset(p);
      addAlert(t("updateSuccessIdentityProvider"), AlertVariant.success);
    } catch (error) {
      addError("updateErrorIdentityProvider", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deleteProvider",
    messageKey: t("deleteConfirmIdentityProvider", { provider: alias }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.identityProviders.del({ alias: alias });
        addAlert(t("deletedSuccessIdentityProvider"), AlertVariant.success);
        navigate(toIdentityProviders({ realm }));
      } catch (error) {
        addError("deleteErrorIdentityProvider", error);
      }
    },
  });

  const [toggleDeleteMapperDialog, DeleteMapperConfirm] = useConfirmDialog({
    titleKey: "deleteProviderMapper",
    messageKey: t("deleteMapperConfirm", {
      mapper: selectedMapper?.name,
    }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.identityProviders.delMapper({
          alias: alias,
          id: selectedMapper?.mapperId!,
        });
        addAlert(t("deleteMapperSuccess"), AlertVariant.success);
        refresh();
        navigate(
          toIdentityProvider({ providerId, alias, tab: "mappers", realm }),
        );
      } catch (error) {
        addError("deleteErrorIdentityProvider", error);
      }
    },
  });
  const jwtAuthorizationGrantEnabled = useWatch({
    control,
    name: "config.jwtAuthorizationGrantEnabled",
  });

  if (!provider) {
    return <KeycloakSpinner />;
  }

  const isOIDC = provider.providerId!.includes("oidc");
  const isSAML = provider.providerId!.includes("saml");
  const isOAuth2 = provider.providerId!.includes("oauth2");
  const isSPIFFE = provider.providerId!.includes("spiffe");
  const isKubernetes = provider.providerId!.includes("kubernetes");
  const isJWTAuthorizationGrant = provider.providerId!.includes(
    "jwt-authorization-grant",
  );
  const isSocial = !isOIDC && !isSAML && !isOAuth2;
  const isJWTAuthorizationGrantSupported =
    (isOAuth2 || isOIDC) &&
    !!provider?.types?.includes(IdentityProviderType.JWT_AUTHORIZATION_GRANT) &&
    isFeatureEnabled(Feature.JWTAuthorizationGrant);
  const groupResource = provider.organizationId
    ? adminClient.organizations.groups(provider.organizationId)
    : adminClient.groups;

  const loader = async () => {
    const [loaderMappers, loaderMapperTypes] = await Promise.all([
      adminClient.identityProviders.findMappers({ alias }),
      adminClient.identityProviders.findMapperTypes({ alias }),
    ]);

    const components = loaderMappers.map((loaderMapper) => {
      const mapperType = Object.values(loaderMapperTypes).find(
        (loaderMapperType) =>
          loaderMapper.identityProviderMapper! === loaderMapperType.id!,
      );

      const result: IdPWithMapperAttributes = {
        ...mapperType,
        name: loaderMapper.name!,
        type: mapperType?.name!,
        mapperId: loaderMapper.id!,
      };

      return result;
    });

    return components;
  };

  const sections = [
    {
      title: t("generalSettings"),
      isHidden: isSPIFFE || isKubernetes || isJWTAuthorizationGrant,
      panel: (
        <FormAccess
          role="manage-identity-providers"
          isHorizontal
          onSubmit={handleSubmit(save)}
        >
          {isSocial && <GeneralSettings create={false} id={providerId} />}
          {(isOIDC || isOAuth2) && <OIDCGeneralSettings />}
          {isSAML && <SamlGeneralSettings isAliasReadonly />}
          {providerInfo && (
            <DynamicComponents stringify properties={providerInfo.properties} />
          )}
        </FormAccess>
      ),
    },
    {
      title: t("oidcSettings"),
      isHidden: !isOIDC,
      panel: (
        <>
          <DiscoverySettings readOnly={false} isOIDC={isOIDC} />
          <Form isHorizontal className="pf-v5-u-py-lg">
            <Divider />
            <OIDCAuthentication create={false} />
          </Form>
          <ExtendedNonDiscoverySettings />
        </>
      ),
    },
    {
      title: t("oAuthSettings"),
      isHidden: !isOAuth2,
      panel: (
        <>
          <DiscoverySettings readOnly={false} isOIDC={isOIDC} />
          <Form isHorizontal className="pf-v5-u-py-lg">
            <Divider />
            <OIDCAuthentication create={false} />
          </Form>
          <UserProfileClaimsSettings />
          <ExtendedOAuth2Settings />
        </>
      ),
    },
    {
      title: t("authorizationGrantSettings"),
      isHidden: !isJWTAuthorizationGrantSupported,
      panel: (
        <>
          <Text className="pf-v5-u-pb-lg">
            {t("authorizationGrantSettingsHelp")}
          </Text>
          <Form
            isHorizontal
            className="pf-v5-u-py-lg"
            onSubmit={handleSubmit(save)}
          >
            <DefaultSwitchControl
              name="config.jwtAuthorizationGrantEnabled"
              label={t("jwtAuthorizationGrantIdpEnabled")}
              labelIcon={t("jwtAuthorizationGrantIdpEnabledHelp")}
              stringify
            />

            {jwtAuthorizationGrantEnabled === "true" && (
              <JWTAuthorizationGrantAssertionSettings />
            )}
          </Form>
        </>
      ),
    },
    {
      title: t("generalSettings"),
      isHidden: !isSPIFFE,
      panel: (
        <Form
          isHorizontal
          className="pf-v5-u-py-lg"
          onSubmit={handleSubmit(save)}
        >
          <SpiffeSettings />
          <FixedButtonsGroup name="idp-details" isSubmit reset={reset} />
        </Form>
      ),
    },
    {
      title: t("generalSettings"),
      isHidden: !isJWTAuthorizationGrant,
      panel: (
        <Form
          isHorizontal
          className="pf-v5-u-py-lg"
          onSubmit={handleSubmit(save)}
        >
          <JWTAuthorizationGrantSettings />
          <FixedButtonsGroup name="idp-details" isSubmit reset={reset} />
        </Form>
      ),
    },
    {
      title: t("generalSettings"),
      isHidden: !isKubernetes,
      panel: (
        <Form
          isHorizontal
          className="pf-v5-u-py-lg"
          onSubmit={handleSubmit(save)}
        >
          <KubernetesSettings />
          <FixedButtonsGroup name="idp-details" isSubmit reset={reset} />
        </Form>
      ),
    },
    {
      title: t("samlSettings"),
      isHidden: !isSAML,
      panel: <DescriptorSettings readOnly={false} />,
    },
    {
      title: t("reqAuthnConstraints"),
      isHidden: !isSAML,
      panel: (
        <FormAccess
          role="manage-identity-providers"
          isHorizontal
          onSubmit={handleSubmit(save)}
        >
          <ReqAuthnConstraints />
        </FormAccess>
      ),
    },
    {
      title: t("advancedSettings"),
      isHidden: isSPIFFE || isKubernetes || isJWTAuthorizationGrant,
      panel: (
        <FormAccess
          role="manage-identity-providers"
          isHorizontal
          onSubmit={handleSubmit(save)}
        >
          <AdvancedSettings
            isOIDC={isOIDC!}
            isSAML={isSAML!}
            isOAuth2={isOAuth2!}
          />

          <FixedButtonsGroup name="idp-details" isSubmit reset={reset} />
        </FormAccess>
      ),
    },
  ];

  return (
    <FormProvider {...form}>
      <DeleteConfirm />
      <DeleteMapperConfirm />
      <Controller
        name="enabled"
        control={form.control}
        defaultValue={true}
        render={({ field }) => (
          <Header
            value={field.value || false}
            onChange={field.onChange}
            save={save}
            toggleDeleteDialog={toggleDeleteDialog}
          />
        )}
      />

      <PageSection variant="light" className="pf-v5-u-p-0">
        <RoutableTabs isBox defaultLocation={toTab("settings")}>
          <Tab
            id="settings"
            title={<TabTitleText>{t("settings")}</TabTitleText>}
            {...settingsTab}
          >
            <ScrollForm
              label={t("jumpToSection")}
              className="pf-v5-u-px-lg"
              sections={sections}
            />
          </Tab>
          <Tab
            id="mappers"
            isHidden={isSPIFFE || isKubernetes || isJWTAuthorizationGrant}
            data-testid="mappers-tab"
            title={<TabTitleText>{t("mappers")}</TabTitleText>}
            {...mappersTab}
          >
            <GroupResourceContext value={groupResource}>
              <DataTable
                t={t}
                emptyState={
                  <ListEmptyState
                    message={t("noMappers")}
                    instructions={t("noMappersInstructions")}
                    primaryActionText={t("addMapper")}
                    onPrimaryAction={() =>
                      navigate(
                        toIdentityProviderAddMapper({
                          realm,
                          alias: alias!,
                          providerId: provider.providerId!,
                          tab: "mappers",
                        }),
                      )
                    }
                  />
                }
                loader={loader}
                key={key}
                ariaLabelKey="mappersList"
                searchPlaceholderKey="searchForMapper"
                toolbarItem={
                  <ToolbarItem>
                    <Button
                      id="add-mapper-button"
                      component={(props) => (
                        <Link
                          {...props}
                          to={toIdentityProviderAddMapper({
                            realm,
                            alias: alias!,
                            providerId: provider.providerId!,
                            tab: "mappers",
                          })}
                        />
                      )}
                      data-testid="addMapper"
                    >
                      {t("addMapper")}
                    </Button>
                  </ToolbarItem>
                }
                columns={[
                  {
                    name: "name",
                    displayKey: "name",
                    cellRenderer: (row) => (
                      <MapperLink {...row} provider={provider} />
                    ),
                  },
                  {
                    name: "category",
                    displayKey: "category",
                  },
                  {
                    name: "type",
                    displayKey: "type",
                  },
                ]}
                actions={[
                  {
                    title: t("delete"),
                    onRowClick: (mapper) => {
                      setSelectedMapper(mapper);
                      toggleDeleteMapperDialog();
                    },
                  } as Action<IdPWithMapperAttributes>,
                ]}
              />
            </GroupResourceContext>
          </Tab>
          {isFeatureEnabled(Feature.AdminFineGrainedAuthz) && (
            <Tab
              id="permissions"
              data-testid="permissionsTab"
              title={<TabTitleText>{t("permissions")}</TabTitleText>}
              {...permissionsTab}
            >
              <PermissionsTab id={alias} type="identityProviders" />
            </Tab>
          )}
          {realmRepresentation?.adminEventsEnabled &&
            hasAccess("view-events") && (
              <Tab
                data-testid="admin-events-tab"
                title={<TabTitleText>{t("adminEvents")}</TabTitleText>}
                {...eventsTab}
              >
                <AdminEvents
                  resourcePath={`identity-provider/instances/${alias}`}
                />
              </Tab>
            )}
        </RoutableTabs>
      </PageSection>
    </FormProvider>
  );
}

export const Route = createFileRoute("/$realm/identity-providers/$providerId/$alias/$tab/")({
  component: DetailSettings,
})
