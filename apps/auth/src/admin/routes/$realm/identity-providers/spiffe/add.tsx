// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../admin-client";
import { useAlerts } from "../../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../../../components/form/FormAccess";
import { ViewHeader } from "../../../../components/view-header/ViewHeader";
import { useRealm } from "../../../../context/realm-context/RealmContext";
import { toIdentityProvider } from "../../../../lib/identity-providers";
import { toIdentityProviders } from "../../../../lib/identity-providers";
import { SpiffeSettings } from "../../../../components/identity-providers/add/SpiffeSettings";

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

type DiscoveryIdentityProvider = IdentityProviderRepresentation & {
  discoveryEndpoint?: string;
};

function AddSpiffeConnect() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const id = "spiffe";

  const form = useForm<DiscoveryIdentityProvider>({
    defaultValues: { alias: id, config: { allowCreate: "true" } },
    mode: "onChange",
  });
  const {
    handleSubmit,
    formState: { isDirty },
  } = form;

  const { addAlert, addError } = useAlerts();
  const { realm } = useRealm();

  const onSubmit = async (provider: DiscoveryIdentityProvider) => {
    delete provider.discoveryEndpoint;
    try {
      await adminClient.identityProviders.create({
        ...provider,
        providerId: id,
      });
      addAlert(t("createIdentityProviderSuccess"), AlertVariant.success);
      navigate(
        toIdentityProvider({
          realm,
          providerId: id,
          alias: provider.alias!,
          tab: "settings",
        }),
      );
    } catch (error: any) {
      addError("createIdentityProviderError", error);
    }
  };

  return (
    <>
      <ViewHeader titleKey={t("addSpiffeProvider")} />
      <PageSection variant="light">
        <FormProvider {...form}>
          <FormAccess
            role="manage-identity-providers"
            isHorizontal
            onSubmit={handleSubmit(onSubmit)}
          >
            <SpiffeSettings />
            <ActionGroup>
              <Button
                isDisabled={!isDirty}
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
        </FormProvider>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/identity-providers/spiffe/add")({
  component: AddSpiffeConnect,
})
