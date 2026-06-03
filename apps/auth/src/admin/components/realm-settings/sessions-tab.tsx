/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/SessionsTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormPanel, HelpItem } from "../../../shared/keycloak-ui-shared";
import { FormAccess } from "../form/form-access";
import { TimeSelector } from "../time-selector/time-selector";

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
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);

type RealmSettingsSessionsTabProps = {
  realm: RealmRepresentation;
  save: (realm: RealmRepresentation) => void;
};

export const RealmSettingsSessionsTab = ({
  realm,
  save,
}: RealmSettingsSessionsTabProps) => {
  const { t } = useTranslation();

  const { control, handleSubmit, formState, reset } =
    useFormContext<RealmRepresentation>();

  const offlineSessionMaxEnabled = useWatch({
    control,
    name: "offlineSessionMaxLifespanEnabled",
  });

  return (
    <PageSection variant="light">
      <FormPanel
        title={t("SSOSessionSettings")}
        className="kc-sso-session-template"
      >
        <FormAccess
          isHorizontal
          role="manage-realm"
          onSubmit={handleSubmit(save)}
        >
          <FormGroup
            label={t("SSOSessionIdle")}
            fieldId="SSOSessionIdle"
            labelIcon={
              <HelpItem
                helpText={t("ssoSessionIdle")}
                fieldLabelId="SSOSessionIdle"
              />
            }
          >
            <Controller
              name="ssoSessionIdleTimeout"
              defaultValue={realm.ssoSessionIdleTimeout}
              control={control}
              render={({ field }) => (
                <TimeSelector
                  className="kc-sso-session-idle"
                  data-testid="sso-session-idle-input"
                  value={field.value!}
                  onChange={field.onChange}
                  units={["minute", "hour", "day"]}
                />
              )}
            />
          </FormGroup>

          <FormGroup
            label={t("SSOSessionMax")}
            fieldId="SSOSessionMax"
            labelIcon={
              <HelpItem
                helpText={t("ssoSessionMax")}
                fieldLabelId="SSOSessionMax"
              />
            }
          >
            <Controller
              name="ssoSessionMaxLifespan"
              control={control}
              render={({ field }) => (
                <TimeSelector
                  className="kc-sso-session-max"
                  data-testid="sso-session-max-input"
                  value={field.value!}
                  onChange={field.onChange}
                  units={["minute", "hour", "day"]}
                />
              )}
            />
          </FormGroup>
          {realm.rememberMe && (
            <>
              <FormGroup
                label={t("SSOSessionIdleRememberMe")}
                fieldId="SSOSessionIdleRememberMe"
                labelIcon={
                  <HelpItem
                    helpText={t("ssoSessionIdleRememberMe")}
                    fieldLabelId="SSOSessionIdleRememberMe"
                  />
                }
              >
                <Controller
                  name="ssoSessionIdleTimeoutRememberMe"
                  control={control}
                  render={({ field }) => (
                    <TimeSelector
                      className="kc-sso-session-idle-remember-me"
                      data-testid="sso-session-idle-remember-me-input"
                      value={field.value!}
                      onChange={field.onChange}
                      units={["minute", "hour", "day"]}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup
                label={t("SSOSessionMaxRememberMe")}
                fieldId="SSOSessionMaxRememberMe"
                labelIcon={
                  <HelpItem
                    helpText={t("ssoSessionMaxRememberMe")}
                    fieldLabelId="SSOSessionMaxRememberMe"
                  />
                }
              >
                <Controller
                  name="ssoSessionMaxLifespanRememberMe"
                  control={control}
                  render={({ field }) => (
                    <TimeSelector
                      className="kc-sso-session-max-remember-me"
                      data-testid="sso-session-max-remember-me-input"
                      value={field.value!}
                      onChange={field.onChange}
                      units={["minute", "hour", "day"]}
                    />
                  )}
                />
              </FormGroup>
            </>
          )}
        </FormAccess>
      </FormPanel>
      <FormPanel
        title={t("clientSessionSettings")}
        className="kc-client-session-template"
      >
        <FormAccess
          isHorizontal
          role="manage-realm"
          className="pf-v5-u-mt-lg"
          onSubmit={handleSubmit(save)}
        >
          <FormGroup
            label={t("clientSessionIdle")}
            fieldId="clientSessionIdle"
            labelIcon={
              <HelpItem
                helpText={t("clientSessionIdleHelp")}
                fieldLabelId="clientSessionIdle"
              />
            }
          >
            <Controller
              name="clientSessionIdleTimeout"
              control={control}
              render={({ field }) => (
                <TimeSelector
                  className="kc-client-session-idle"
                  data-testid="client-session-idle-input"
                  value={field.value!}
                  onChange={field.onChange}
                  units={["minute", "hour", "day"]}
                />
              )}
            />
          </FormGroup>

          <FormGroup
            label={t("clientSessionMax")}
            fieldId="clientSessionMax"
            labelIcon={
              <HelpItem
                helpText={t("clientSessionMaxHelp")}
                fieldLabelId="clientSessionMax"
              />
            }
          >
            <Controller
              name="clientSessionMaxLifespan"
              control={control}
              render={({ field }) => (
                <TimeSelector
                  className="kc-client-session-max"
                  data-testid="client-session-max-input"
                  value={field.value!}
                  onChange={field.onChange}
                  units={["minute", "hour", "day"]}
                />
              )}
            />
          </FormGroup>
        </FormAccess>
      </FormPanel>
      <FormPanel
        title={t("offlineSessionSettings")}
        className="kc-offline-session-template"
      >
        <FormAccess
          isHorizontal
          role="manage-realm"
          className="pf-v5-u-mt-lg"
          onSubmit={handleSubmit(save)}
        >
          <FormGroup
            label={t("offlineSessionIdle")}
            fieldId="offlineSessionIdle"
            labelIcon={
              <HelpItem
                helpText={t("offlineSessionIdleHelp")}
                fieldLabelId="offlineSessionIdle"
              />
            }
          >
            <Controller
              name="offlineSessionIdleTimeout"
              control={control}
              render={({ field }) => (
                <TimeSelector
                  className="kc-offline-session-idle"
                  data-testid="offline-session-idle-input"
                  aria-label="offline-session-idle-input"
                  value={field.value!}
                  onChange={field.onChange}
                  units={["minute", "hour", "day"]}
                />
              )}
            />
          </FormGroup>

          <FormGroup
            label={t("clientOfflineSessionIdle")}
            fieldId="clientOfflineSessionIdle"
            labelIcon={
              <HelpItem
                helpText={t("clientOfflineSessionIdleHelp")}
                fieldLabelId="clientOfflineSessionIdle"
              />
            }
          >
            <Controller
              name="clientOfflineSessionIdleTimeout"
              control={control}
              render={({ field }) => (
                <TimeSelector
                  className="kc-client-offline-session-idle"
                  data-testid="client-offline-session-idle-input"
                  aria-label="client-offline-session-idle-input"
                  value={field.value!}
                  onChange={field.onChange}
                  units={["minute", "hour", "day"]}
                />
              )}
            />
          </FormGroup>

          <FormGroup
            hasNoPaddingTop
            label={t("offlineSessionMaxLimited")}
            fieldId="kc-offlineSessionMaxLimited"
            labelIcon={
              <HelpItem
                helpText={t("offlineSessionMaxLimitedHelp")}
                fieldLabelId="offlineSessionMaxLimited"
              />
            }
          >
            <Controller
              name="offlineSessionMaxLifespanEnabled"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Switch
                  id="kc-offline-session-max"
                  data-testid="offline-session-max-switch"
                  aria-label={t("offlineSessionMaxLimited")}
                  label={t("enabled")}
                  labelOff={t("disabled")}
                  isChecked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormGroup>
          {offlineSessionMaxEnabled && (
            <FormGroup
              label={t("offlineSessionMax")}
              fieldId="offlineSessionMax"
              id="offline-session-max-label"
              labelIcon={
                <HelpItem
                  helpText={t("offlineSessionMaxHelp")}
                  fieldLabelId="offlineSessionMax"
                />
              }
            >
              <Controller
                name="offlineSessionMaxLifespan"
                control={control}
                render={({ field }) => (
                  <TimeSelector
                    className="kc-offline-session-max"
                    data-testid="offline-session-max-input"
                    value={field.value!}
                    onChange={field.onChange}
                    units={["minute", "hour", "day"]}
                  />
                )}
              />
            </FormGroup>
          )}
          {offlineSessionMaxEnabled && (
            <FormGroup
              label={t("clientOfflineSessionMax")}
              fieldId="clientOfflineSessionMax"
              id="client-offline-session-max-label"
              labelIcon={
                <HelpItem
                  helpText={t("clientOfflineSessionMaxHelp")}
                  fieldLabelId="clientOfflineSessionMax"
                />
              }
            >
              <Controller
                name="clientOfflineSessionMaxLifespan"
                control={control}
                render={({ field }) => (
                  <TimeSelector
                    className="kc-client-offline-session-max"
                    data-testid="client-offline-session-max-input"
                    value={field.value!}
                    onChange={field.onChange}
                    units={["minute", "hour", "day"]}
                  />
                )}
              />
            </FormGroup>
          )}
        </FormAccess>
      </FormPanel>
      <FormPanel
        className="kc-login-settings-template"
        title={t("loginSettings")}
      >
        <FormAccess
          isHorizontal
          role="manage-realm"
          className="pf-v5-u-mt-lg"
          onSubmit={handleSubmit(save)}
        >
          <FormGroup
            label={t("loginTimeout")}
            id="kc-login-timeout-label"
            fieldId="offlineSessionIdle"
            labelIcon={
              <HelpItem
                helpText={t("loginTimeoutHelp")}
                fieldLabelId="loginTimeout"
              />
            }
          >
            <Controller
              name="accessCodeLifespanLogin"
              control={control}
              render={({ field }) => (
                <TimeSelector
                  className="kc-login-timeout"
                  data-testid="login-timeout-input"
                  aria-label="login-timeout-input"
                  value={field.value!}
                  onChange={field.onChange}
                  units={["minute", "hour", "day"]}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("loginActionTimeout")}
            fieldId="loginActionTimeout"
            id="login-action-timeout-label"
            labelIcon={
              <HelpItem
                helpText={t("loginActionTimeoutHelp")}
                fieldLabelId="loginActionTimeout"
              />
            }
          >
            <Controller
              name="accessCodeLifespanUserAction"
              control={control}
              render={({ field }) => (
                <TimeSelector
                  className="kc-login-action-timeout"
                  data-testid="login-action-timeout-input"
                  value={field.value!}
                  onChange={field.onChange}
                  units={["minute", "hour", "day"]}
                />
              )}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              type="submit"
              data-testid="sessions-tab-save"
              isDisabled={!formState.isDirty}
            >
              {t("save")}
            </Button>
            <Button variant="link" onClick={() => reset(realm)}>
              {t("revert")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </FormPanel>
    </PageSection>
  );
};
