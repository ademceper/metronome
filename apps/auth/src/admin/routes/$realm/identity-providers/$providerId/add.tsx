// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../admin-client";
import { useAlerts } from "../../../../../shared/keycloak-ui-shared";
import { DynamicComponents } from "../../../../components/dynamic/dynamic-components";
import { FormAccess } from "../../../../components/form/form-access";
import { ViewHeader } from "../../../../components/view-header/view-header";
import { useRealm } from "../../../../context/realm-context/realm-context";
import { useServerInfo } from "../../../../context/server-info/server-info-provider";
import { toUpperCase } from "../../../../util";
import { useParams } from "../../../../utils/use-params";
import { toIdentityProvider } from "../../../../lib/identity-providers";
import type { IdentityProviderCreateParams } from "../../../../lib/identity-providers";
import { toIdentityProviders } from "../../../../lib/identity-providers";
import { GeneralSettings } from "../../../../components/identity-providers/add/general-settings";

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

function AddIdentityProvider() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { providerId } = useParams<IdentityProviderCreateParams>();
  const form = useForm<IdentityProviderRepresentation>({ mode: "onChange" });
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

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const { addAlert, addError } = useAlerts();
  const navigate = useNavigate();
  const { realm } = useRealm();

  const onSubmit = async (provider: IdentityProviderRepresentation) => {
    try {
      await adminClient.identityProviders.create({
        ...provider,
        providerId,
        alias: provider.alias!,
      });
      addAlert(t("createIdentityProviderSuccess"), AlertVariant.success);
      navigate(
        toIdentityProvider({
          realm,
          providerId,
          alias: provider.alias!,
          tab: "settings",
        }),
      );
    } catch (error) {
      addError("createError", error);
    }
  };

  const alias = form.getValues("alias");

  if (!alias) {
    form.setValue("alias", providerId);
  }

  return (
    <>
      <ViewHeader
        titleKey={t("addIdentityProvider", {
          provider: toUpperCase(providerId),
        })}
      />
      <PageSection variant="light">
        <FormAccess
          role="manage-identity-providers"
          isHorizontal
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormProvider {...form}>
            <GeneralSettings id={providerId} />
            {providerInfo && (
              <DynamicComponents
                stringify
                properties={providerInfo.properties}
              />
            )}
          </FormProvider>
          <ActionGroup>
            <Button
              isDisabled={!isValid}
              variant="primary"
              type="submit"
              data-testid="createProvider"
            >
              {t("add")}
            </Button>
            <Button
              variant="link"
              data-testid="cancel"
              component={(props) => (
                <Link {...props} to={toIdentityProviders({ realm })} />
              )}
            >
              {t("cancel")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/identity-providers/$providerId/add")({
  component: AddIdentityProvider,
})
