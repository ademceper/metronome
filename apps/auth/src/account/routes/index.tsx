/* eslint-disable */
// @ts-nocheck

import {
  UserProfileFields,
  beerify,
  debeerify,
  setUserProfileServerError,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Collapsible as UICollapsible, CollapsibleContent as UICollapsibleContent, CollapsibleTrigger as UICollapsibleTrigger } from "@metronome/ui/components/collapsible";
import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { cn } from "@metronome/ui/lib/utils";
import { ArrowSquareOut as ExternalLinkSquareAltIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { TFunction } from "i18next";
import { useState } from "react";
import { ErrorOption, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  getPersonalInfo,
  getSupportedLocales,
  savePersonalInfo,
} from "../lib/api/methods";
import {
  UserProfileMetadata,
  UserRepresentation,
} from "../lib/api/representations";
import { Page } from "../components/Page";
import { type AccountEnvironment } from "..";
import type { TFuncKey } from "../i18n/types";
import { useAccountAlerts } from "../lib/useAccountAlerts";
import { usePromise } from "../lib/usePromise";


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
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
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
const ExpandableSection = ({ toggleText, toggleTextExpanded, toggleTextCollapsed, isExpanded, onToggle, isDetached, children, ...props }: any) => (
  <UICollapsible open={isExpanded} onOpenChange={(open: boolean) => onToggle?.(undefined, open)} {...props}>
    <UICollapsibleTrigger className="flex items-center gap-2 text-sm">
      {isExpanded ? (toggleTextExpanded ?? toggleText) : (toggleTextCollapsed ?? toggleText)}
    </UICollapsibleTrigger>
    <UICollapsibleContent>{children}</UICollapsibleContent>
  </UICollapsible>
);
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;

export const Route = createFileRoute("/")({
  component: PersonalInfo,
});

function PersonalInfo() {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();
  const [userProfileMetadata, setUserProfileMetadata] =
    useState<UserProfileMetadata>();
  const [supportedLocales, setSupportedLocales] = useState<string[]>([]);
  const form = useForm<UserRepresentation>({ mode: "onChange" });
  const { handleSubmit, reset, setValue, setError } = form;
  const { addAlert } = useAccountAlerts();

  usePromise(
    (signal) =>
      Promise.all([
        getPersonalInfo({ signal, context }),
        getSupportedLocales({ signal, context }),
      ]),
    ([personalInfo, supportedLocales]) => {
      setUserProfileMetadata(personalInfo.userProfileMetadata);
      setSupportedLocales(supportedLocales);
      reset(personalInfo);
      Object.entries(personalInfo.attributes || {}).forEach(([k, v]) =>
        setValue(`attributes[${beerify(k)}]`, v),
      );
    },
  );

  const onSubmit = async (user: UserRepresentation) => {
    try {
      const attributes = Object.fromEntries(
        Object.entries(user.attributes || {}).map(([k, v]) => [
          debeerify(k),
          v,
        ]),
      );
      await savePersonalInfo(context, { ...user, attributes });
      const locale = attributes["locale"]?.toString();
      if (locale) {
        window.dispatchEvent(
          new CustomEvent("languageChanged", { detail: { language: locale } }),
        );
      }
      await context.keycloak.updateToken();
      addAlert(t("accountUpdatedMessage"));
    } catch (error) {
      addAlert(t("accountUpdatedError"), AlertVariant.danger);

      setUserProfileServerError(
        { responseData: { errors: error as any } },
        (name: string | number, error: unknown) =>
          setError(name as string, error as ErrorOption),
        ((key: TFuncKey, param?: object) => t(key, param as any)) as TFunction,
      );
    }
  };

  if (!userProfileMetadata) {
    return <Spinner />;
  }

  const allFieldsReadOnly = () =>
    userProfileMetadata?.attributes
      ?.map((a) => a.readOnly)
      .reduce((p, c) => p && c, true);

  const {
    updateEmailFeatureEnabled,
    updateEmailActionEnabled,
    isRegistrationEmailAsUsername,
    isEditUserNameAllowed,
  } = context.environment.features;
  return (
    <Page
      title={t("personalInfo")}
      description={t("personalInfoDescription")}
      action={
        context.environment.features.deleteAccountAllowed ? (
          <Button
            id="delete-account-btn"
            data-testid="delete-account"
            variant="destructive"
            className="bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
            onClick={() =>
              context.keycloak.login({ action: "delete_account" })
            }
          >
            {t("deleteAccount")}
          </Button>
        ) : undefined
      }
    >
      <Form isHorizontal onSubmit={handleSubmit(onSubmit)}>
        <UserProfileFields
          form={form}
          userProfileMetadata={userProfileMetadata}
          supportedLocales={supportedLocales}
          currentLocale={context.environment.locale}
          t={
            ((key: unknown, params) =>
              t(key as TFuncKey, params as any)) as TFunction
          }
          renderer={(attribute) => {
            const annotations = attribute.annotations
              ? attribute.annotations
              : {};
            return attribute.name === "email" &&
              updateEmailFeatureEnabled &&
              updateEmailActionEnabled &&
              annotations["kc.required.action.supported"] &&
              (!isRegistrationEmailAsUsername || isEditUserNameAllowed) ? (
              <Button
                id="update-email-btn"
                variant="link"
                onClick={() =>
                  context.keycloak.login({ action: "UPDATE_EMAIL" })
                }
                icon={<ExternalLinkSquareAltIcon />}
                iconPosition="right"
              >
                {t("updateEmail")}
              </Button>
            ) : undefined;
          }}
        />
        {!allFieldsReadOnly() && (
          <ActionGroup>
            <Button
              data-testid="save"
              type="submit"
              id="save-btn"
              variant="primary"
              size="xl"
              className="flex-1"
            >
              {t("save")}
            </Button>
            <Button
              data-testid="cancel"
              id="cancel-btn"
              variant="tertiary"
              size="xl"
              className="flex-1"
              onClick={() => reset()}
            >
              {t("cancel")}
            </Button>
          </ActionGroup>
        )}
      </Form>
    </Page>
  );
}
