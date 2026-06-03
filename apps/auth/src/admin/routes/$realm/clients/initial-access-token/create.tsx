// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type ClientInitialAccessPresentation from "@keycloak/keycloak-admin-client/lib/defs/clientInitialAccessPresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { NumberControl } from "../../../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../../../admin-client";
import { useAlerts } from "../../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../../../components/form/form-access";
import { TimeSelectorControl } from "../../../../components/time-selector/time-selector-control";
import { ViewHeader } from "../../../../components/view-header/view-header";
import { useRealm } from "../../../../context/realm-context/realm-context";
import { toClients } from "../../../../lib/clients";
import { AccessTokenDialog } from "../../../../components/clients/initial-access/access-token-dialog";
import { MultiLineInput } from "../../../../components/multi-line-input/multi-line-input";
import { HelpItem } from "../../../../../shared/keycloak-ui-shared";

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

function CreateInitialAccessToken() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm({ mode: "onChange" });
  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();

  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const save = async (clientToken: ClientInitialAccessPresentation) => {
    try {
      const access = await adminClient.realms.createClientsInitialAccess(
        { realm },
        clientToken,
      );
      setToken(access.token!);
    } catch (error) {
      addError("tokenSaveError", error);
    }
  };

  return (
    <FormProvider {...form}>
      {token && (
        <AccessTokenDialog
          token={token}
          toggleDialog={() => {
            setToken("");
            addAlert(t("tokenSaveSuccess"), AlertVariant.success);
            navigate(toClients({ realm, tab: "initial-access-token" }));
          }}
        />
      )}
      <ViewHeader titleKey="createToken" subKey="createTokenHelp" />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          role="create-client"
          onSubmit={handleSubmit(save)}
        >
          <TimeSelectorControl
            name="expiration"
            label={t("expiration")}
            labelIcon={t("tokenExpirationHelp")}
            controller={{
              defaultValue: 86400,
              rules: {
                min: {
                  value: 1,
                  message: t("expirationValueNotValid"),
                },
              },
            }}
          />
          <NumberControl
            name="count"
            label={t("count")}
            labelIcon={t("countHelp")}
            controller={{
              rules: {
                min: 1,
              },
              defaultValue: 1,
            }}
          />
          <FormGroup
            label={t("webOrigins")}
            fieldId="kc-web-origins"
            labelIcon={
              <HelpItem
                helpText={t("webOriginsHelp")}
                fieldLabelId="webOrigins"
              />
            }
          >
            <MultiLineInput
              id="kc-web-origins"
              name="webOrigins"
              aria-label={t("webOrigins")}
              addButtonLabel="addWebOrigins"
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              type="submit"
              data-testid="save"
              isDisabled={!isValid}
            >
              {t("save")}
            </Button>
            <Button
              data-testid="cancel"
              variant="link"
              component={(props) => (
                <Link
                  {...props}
                  to={toClients({ realm, tab: "initial-access-token" })}
                />
              )}
            >
              {t("cancel")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </FormProvider>
  );
}

export const Route = createFileRoute("/$realm/clients/initial-access-token/create")({
  component: CreateInitialAccessToken,
})
