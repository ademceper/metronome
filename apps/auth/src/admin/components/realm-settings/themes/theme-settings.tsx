/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/ThemeSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { SelectControl } from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormAccess } from "../../form/form-access";
import { DefaultSwitchControl } from "../../switch-control";
import { useServerInfo } from "../../../context/server-info/server-info-provider";
import { convertToFormValues } from "../../../util";


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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

type ThemeSettingsTabProps = {
  realm: RealmRepresentation;
  save: (realm: RealmRepresentation) => void;
};

export const ThemeSettingsTab = ({ realm, save }: ThemeSettingsTabProps) => {
  const { t } = useTranslation();

  const form = useForm<RealmRepresentation>();
  const { handleSubmit, setValue } = form;
  const themeTypes = useServerInfo().themes!;

  const setupForm = () => {
    convertToFormValues(realm, setValue);
  };
  useEffect(setupForm, []);

  const appendEmptyChoice = (items: { key: string; value: string }[]) => [
    { key: "", value: t("choose") },
    ...items,
  ];

  return (
    <PageSection variant="light">
      <FormAccess
        isHorizontal
        role="manage-realm"
        className="pf-v5-u-mt-lg"
        onSubmit={handleSubmit(save)}
      >
        <FormProvider {...form}>
          <DefaultSwitchControl
            name="attributes.darkMode"
            labelIcon={t("darkModeEnabledHelp")}
            label={t("darkModeEnabled")}
            defaultValue="true"
            stringify
          />
          <SelectControl
            id="kc-login-theme"
            name="loginTheme"
            label={t("loginTheme")}
            labelIcon={t("loginThemeHelp")}
            controller={{ defaultValue: "" }}
            options={appendEmptyChoice(
              themeTypes.login.map((theme) => ({
                key: theme.name,
                value: theme.name,
                description: theme.description,
              })),
            )}
          />
          <SelectControl
            id="kc-account-theme"
            name="accountTheme"
            label={t("accountTheme")}
            labelIcon={t("accountThemeHelp")}
            placeholderText={t("selectATheme")}
            controller={{ defaultValue: "" }}
            options={appendEmptyChoice(
              themeTypes.account.map((theme) => ({
                key: theme.name,
                value: theme.name,
                description: theme.description,
              })),
            )}
          />
          <SelectControl
            id="kc-admin-theme"
            name="adminTheme"
            label={t("adminTheme")}
            labelIcon={t("adminThemeHelp")}
            placeholderText={t("selectATheme")}
            controller={{ defaultValue: "" }}
            options={appendEmptyChoice(
              themeTypes.admin.map((theme) => ({
                key: theme.name,
                value: theme.name,
                description: theme.description,
              })),
            )}
          />
          <SelectControl
            id="kc-email-theme"
            name="emailTheme"
            label={t("emailTheme")}
            labelIcon={t("emailThemeHelp")}
            placeholderText={t("selectATheme")}
            controller={{ defaultValue: "" }}
            options={appendEmptyChoice(
              themeTypes.email.map((theme) => ({
                key: theme.name,
                value: theme.name,
                description: theme.description,
              })),
            )}
          />
        </FormProvider>
        <ActionGroup>
          <Button variant="primary" type="submit" data-testid="themes-tab-save">
            {t("save")}
          </Button>
          <Button variant="link" onClick={setupForm}>
            {t("revert")}
          </Button>
        </ActionGroup>
      </FormAccess>
    </PageSection>
  );
};
