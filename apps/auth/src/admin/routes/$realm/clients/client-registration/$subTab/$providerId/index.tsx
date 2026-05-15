// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import {
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../../admin-client";
import { useConfirmDialog } from "../../../../../../components/confirm-dialog/ConfirmDialog";
import { DynamicComponents } from "../../../../../../components/dynamic/DynamicComponents";
import { FormAccess } from "../../../../../../components/form/FormAccess";
import { KeycloakSpinner } from "../../../../../../../shared/keycloak-ui-shared";
import { ViewHeader } from "../../../../../../components/view-header/ViewHeader";
import { useRealm } from "../../../../../../context/realm-context/RealmContext";
import { useParams } from "../../../../../../utils/useParams";
import {
  RegistrationProviderParams,
  toRegistrationProvider,
} from "../../../../../../lib/clients";
import { toClientRegistration } from "../../../../../../lib/clients";

const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

function DetailProvider() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { id, providerId, subTab } = useParams<RegistrationProviderParams>();
  const navigate = useNavigate();
  const form = useForm<ComponentRepresentation>({
    defaultValues: { providerId },
  });
  const { control, handleSubmit, reset } = form;

  const { realm, realmRepresentation } = useRealm();
  const { addAlert, addError } = useAlerts();
  const [provider, setProvider] = useState<ComponentTypeRepresentation>();

  useFetch(
    async () =>
      await Promise.all([
        adminClient.realms.getClientRegistrationPolicyProviders({ realm }),
        id ? adminClient.components.findOne({ id }) : Promise.resolve(),
      ]),
    ([providers, data]) => {
      setProvider(providers.find((p) => p.id === providerId));
      reset(data || { providerId });
    },
    [],
  );

  const providerName = useWatch({ control, defaultValue: "", name: "name" });

  const onSubmit = async (component: ComponentRepresentation) => {
    if (component.config)
      Object.entries(component.config).forEach(
        ([key, value]) =>
          (component.config![key] = Array.isArray(value) ? value : [value]),
      );
    try {
      const updatedComponent = {
        ...component,
        subType: subTab,
        parentId: realmRepresentation?.id,
        providerType:
          "org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy",
        providerId,
      };
      if (id) {
        await adminClient.components.update({ id }, updatedComponent);
      } else {
        const { id } = await adminClient.components.create(updatedComponent);
        navigate(toRegistrationProvider({ id, realm, subTab, providerId }));
      }
      addAlert(t(`provider${id ? "Updated" : "Create"}Success`));
    } catch (error) {
      addError(`provider${id ? "Updated" : "Create"}Error`, error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "clientRegisterPolicyDeleteConfirmTitle",
    messageKey: t("clientRegisterPolicyDeleteConfirm", {
      name: providerName,
    }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.components.del({
          realm,
          id: id!,
        });
        addAlert(t("clientRegisterPolicyDeleteSuccess"));
        navigate(toClientRegistration({ realm, subTab }));
      } catch (error) {
        addError("clientRegisterPolicyDeleteError", error);
      }
    },
  });

  if (!provider) {
    return <KeycloakSpinner />;
  }

  return (
    <>
      <ViewHeader
        titleKey={id ? providerName! : "createPolicy"}
        subKey={id}
        dropdownItems={
          id
            ? [
                <DropdownItem
                  data-testid="delete"
                  key="delete"
                  onClick={toggleDeleteDialog}
                >
                  {t("delete")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
      <DeleteConfirm />
      <PageSection variant="light">
        <FormProvider {...form}>
          <FormAccess
            role="manage-clients"
            isHorizontal
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextControl name="providerId" label={t("provider")} readOnly />
            <TextControl
              name="name"
              label={t("name")}
              labelIcon={t("clientPolicyNameHelp")}
              rules={{ required: t("required") }}
            />
            <DynamicComponents properties={provider.properties} />
            <ActionGroup>
              <Button data-testid="save" type="submit">
                {t("save")}
              </Button>
              <Button
                data-testid="cancel"
                variant="link"
                component={(props) => (
                  <Link
                    {...props}
                    to={toClientRegistration({ realm, subTab })}
                  ></Link>
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

export const Route = createFileRoute("/$realm/clients/client-registration/$subTab/$providerId/")({
  component: DetailProvider,
})
