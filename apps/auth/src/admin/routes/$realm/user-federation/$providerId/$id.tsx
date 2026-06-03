// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import {
  KeycloakSpinner,
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../admin-client";
import { DynamicComponents } from "../../../../components/dynamic/dynamic-components";
import { FormAccess } from "../../../../components/form/form-access";
import { useRealm } from "../../../../context/realm-context/realm-context";
import { useServerInfo } from "../../../../context/server-info/server-info-provider";
import { convertFormValuesToObject, convertToFormValues } from "../../../../util";
import { useParams } from "../../../../utils/use-params";
import type { CustomUserFederationRouteParams } from "../../../../lib/user-federation";
import { toUserFederation } from "../../../../lib/user-federation";
import { ExtendedHeader } from "../../../../components/user-federation/shared/extended-header";
import { SettingsCache } from "../../../../components/user-federation/shared/settings-cache";
import { SyncSettings } from "../../../../components/user-federation/custom/sync-settings";
import { useState } from "react";

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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

function CustomProviderSettings() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { id, providerId } = useParams<CustomUserFederationRouteParams>();
  const navigate = useNavigate();
  const form = useForm<ComponentRepresentation>({
    mode: "onChange",
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const { addAlert, addError } = useAlerts();
  const { realm: realmName, realmRepresentation: realm } = useRealm();
  const [loading, setLoading] = useState(true);

  const provider = (
    useServerInfo().componentTypes?.[
      "org.keycloak.storage.UserStorageProvider"
    ] || []
  ).find((p) => p.id === providerId);

  useFetch(
    async () => {
      if (id) {
        return await adminClient.components.findOne({ id });
      }
      return undefined;
    },
    (fetchedComponent) => {
      if (fetchedComponent) {
        convertToFormValues(fetchedComponent, setValue);
      } else if (id) {
        throw new Error(t("notFound"));
      }
      setLoading(false);
    },
    [],
  );

  const save = async (component: ComponentRepresentation) => {
    const saveComponent = convertFormValuesToObject({
      ...component,
      config: Object.fromEntries(
        Object.entries(component.config || {}).map(([key, value]) => [
          key,
          Array.isArray(value) ? value : [value],
        ]),
      ),
      providerId,
      providerType: "org.keycloak.storage.UserStorageProvider",
      parentId: realm?.id,
    });

    try {
      if (!id) {
        await adminClient.components.create(saveComponent);
        navigate(toUserFederation({ realm: realmName }));
      } else {
        await adminClient.components.update({ id }, saveComponent);
      }
      reset({ ...component });
      addAlert(
        t(!id ? "createUserProviderSuccess" : "userProviderSaveSuccess"),
        AlertVariant.success,
      );
    } catch (error) {
      addError(
        !id ? "createUserProviderError" : "userProviderSaveError",
        error,
      );
    }
  };

  if (loading) return <KeycloakSpinner />;

  return (
    <FormProvider {...form}>
      <ExtendedHeader provider={providerId} save={() => handleSubmit(save)()} />
      <PageSection variant="light">
        <FormAccess
          role="manage-realm"
          isHorizontal
          className="keycloak__user-federation__custom-form"
          onSubmit={handleSubmit(save)}
        >
          <TextControl
            name="name"
            label={t("uiDisplayName")}
            labelIcon={t("uiDisplayNameHelp")}
            rules={{
              required: t("validateName"),
            }}
          />
          <DynamicComponents properties={provider?.properties || []} />
          {provider?.metadata.synchronizable && <SyncSettings />}
          <SettingsCache form={form} unWrap />
          <ActionGroup>
            <Button
              isDisabled={!isDirty}
              variant="primary"
              type="submit"
              data-testid="custom-save"
            >
              {t("save")}
            </Button>
            <Button
              variant="link"
              component={(props) => (
                <Link {...props} to={toUserFederation({ realm: realmName })} />
              )}
              data-testid="custom-cancel"
            >
              {t("cancel")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </FormProvider>
  );
}

export const Route = createFileRoute("/$realm/user-federation/$providerId/$id")({
  component: CustomProviderSettings,
})
