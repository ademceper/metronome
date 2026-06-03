// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import {
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../../../admin-client";
import { DynamicComponents } from "../../../../../../../components/dynamic/dynamic-components";
import { FormAccess } from "../../../../../../../components/form/form-access";
import { ViewHeader } from "../../../../../../../components/view-header/view-header";
import { useServerInfo } from "../../../../../../../context/server-info/server-info-provider";
import { KEY_PROVIDER_TYPE } from "../../../../../../../util";
import { useParams } from "../../../../../../../utils/use-params";
import { KeyProviderParams, ProviderType } from "../../../../../../../lib/realm-settings";
import { toKeysTab } from "../../../../../../../lib/realm-settings";

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

type KeyProviderFormProps = {
  id?: string;
  providerType: ProviderType;
  onClose?: () => void;
};

export const KeyProviderForm = ({
  providerType,
  onClose,
}: KeyProviderFormProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { addAlert, addError } = useAlerts();

  const serverInfo = useServerInfo();
  const allComponentTypes =
    serverInfo.componentTypes?.[KEY_PROVIDER_TYPE] ?? [];

  const form = useForm<ComponentRepresentation>({
    mode: "onChange",
  });
  const { handleSubmit, reset } = form;

  const save = async (component: ComponentRepresentation) => {
    if (component.config)
      Object.entries(component.config).forEach(
        ([key, value]) =>
          (component.config![key] = Array.isArray(value) ? value : [value]),
      );
    try {
      if (id) {
        await adminClient.components.update(
          { id },
          {
            ...component,
            providerType: KEY_PROVIDER_TYPE,
          },
        );
        addAlert(t("saveProviderSuccess"), AlertVariant.success);
      } else {
        await adminClient.components.create({
          ...component,
          providerId: providerType,
          providerType: KEY_PROVIDER_TYPE,
        });
        addAlert(t("saveProviderSuccess"), AlertVariant.success);
        onClose?.();
      }
    } catch (error) {
      addError("saveProviderError", error);
    }
  };

  useFetch(
    async () => {
      if (id) return await adminClient.components.findOne({ id });
    },
    (result) => {
      if (result) {
        reset({ ...result });
      }
    },
    [],
  );

  return (
    <FormAccess isHorizontal role="manage-realm" onSubmit={handleSubmit(save)}>
      <FormProvider {...form}>
        {id && (
          <TextControl
            name="id"
            label={t("providerId")}
            labelIcon={t("providerIdHelp")}
            rules={{
              required: t("required"),
            }}
            readOnly
          />
        )}
        <TextControl
          name="name"
          defaultValue={providerType}
          label={t("name")}
          labelIcon={t("keyProviderMapperNameHelp")}
          rules={{
            required: t("required"),
          }}
        />
        <DynamicComponents
          properties={
            allComponentTypes.find((type) => type.id === providerType)
              ?.properties || []
          }
        />
        <ActionGroup>
          <Button
            data-testid="add-provider-button"
            variant="primary"
            type="submit"
          >
            {t("save")}
          </Button>
          <Button onClick={() => onClose?.()} variant="link">
            {t("cancel")}
          </Button>
        </ActionGroup>
      </FormProvider>
    </FormAccess>
  );
};

function KeyProviderFormPage() {
  const { t } = useTranslation();
  const params = useParams<KeyProviderParams>();
  const navigate = useNavigate();

  return (
    <>
      <ViewHeader titleKey={t("editProvider")} subKey={params.providerType} />
      <PageSection variant="light">
        <KeyProviderForm
          {...params}
          onClose={() =>
            navigate(toKeysTab({ realm: params.realm, tab: "providers" }))
          }
        />
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/realm-settings/keys/providers/$id/$providerType/settings")({
  component: KeyProviderFormPage,
})
