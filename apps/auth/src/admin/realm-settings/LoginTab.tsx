/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/LoginTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { FormPanel, HelpItem } from "../../shared/keycloak-ui-shared";
import { useAdminClient } from "../admin-client";
import { useAlerts } from "../../shared/keycloak-ui-shared";
import { FormAccess } from "../components/form/FormAccess";
import { useRealm } from "../context/realm-context/RealmContext";


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

type RealmSettingsLoginTabProps = {
  realm: RealmRepresentation;
  refresh: () => void;
};

type SwitchType = { [K in keyof RealmRepresentation]: boolean };

export const RealmSettingsLoginTab = ({
  realm,
  refresh,
}: RealmSettingsLoginTabProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();

  const { addAlert, addError } = useAlerts();
  const { realm: realmName } = useRealm();

  const updateSwitchValue = async (switches: SwitchType | SwitchType[]) => {
    const name = Array.isArray(switches)
      ? Object.keys(switches[0])[0]
      : Object.keys(switches)[0];

    try {
      await adminClient.realms.update(
        {
          realm: realmName,
        },
        Array.isArray(switches)
          ? switches.reduce((realm, s) => Object.assign(realm, s), realm)
          : Object.assign(realm, switches),
      );
      addAlert(t("enableSwitchSuccess", { switch: t(name) }));
      refresh();
    } catch (error) {
      addError("enableSwitchError", error);
    }
  };

  return (
    <PageSection variant="light">
      <FormPanel
        className="kc-login-screen"
        title={t("loginScreenCustomization")}
      >
        <FormAccess isHorizontal role="manage-realm">
          <FormGroup
            label={t("registrationAllowed")}
            fieldId="kc-user-reg"
            labelIcon={
              <HelpItem
                helpText={t("userRegistrationHelpText")}
                fieldLabelId="registrationAllowed"
              />
            }
            hasNoPaddingTop
          >
            <Switch
              id="kc-user-reg-switch"
              data-testid="user-reg-switch"
              value={realm.registrationAllowed ? "on" : "off"}
              label={t("on")}
              labelOff={t("off")}
              isChecked={realm.registrationAllowed}
              onChange={async (_event, value) => {
                await updateSwitchValue({ registrationAllowed: value });
              }}
              aria-label={t("registrationAllowed")}
            />
          </FormGroup>
          <FormGroup
            label={t("resetPasswordAllowed")}
            fieldId="kc-forgot-pw"
            labelIcon={
              <HelpItem
                helpText={t("forgotPasswordHelpText")}
                fieldLabelId="resetPasswordAllowed"
              />
            }
            hasNoPaddingTop
          >
            <Switch
              id="kc-forgot-pw-switch"
              data-testid="forgot-pw-switch"
              name="resetPasswordAllowed"
              value={realm.resetPasswordAllowed ? "on" : "off"}
              label={t("on")}
              labelOff={t("off")}
              isChecked={realm.resetPasswordAllowed}
              onChange={async (_event, value) => {
                await updateSwitchValue({ resetPasswordAllowed: value });
              }}
              aria-label={t("resetPasswordAllowed")}
            />
          </FormGroup>
          <FormGroup
            label={t("rememberMe")}
            fieldId="kc-remember-me"
            labelIcon={
              <HelpItem
                helpText={t("rememberMeHelpText")}
                fieldLabelId="rememberMe"
              />
            }
            hasNoPaddingTop
          >
            <Switch
              id="kc-remember-me-switch"
              data-testid="remember-me-switch"
              value={realm.rememberMe ? "on" : "off"}
              label={t("on")}
              labelOff={t("off")}
              isChecked={realm.rememberMe}
              onChange={async (_event, value) => {
                await updateSwitchValue({ rememberMe: value });
              }}
              aria-label={t("rememberMe")}
            />
          </FormGroup>
        </FormAccess>
      </FormPanel>
      <FormPanel className="kc-email-settings" title={t("emailSettings")}>
        <FormAccess isHorizontal role="manage-realm">
          <FormGroup
            label={t("registrationEmailAsUsername")}
            fieldId="kc-email-as-username"
            labelIcon={
              <HelpItem
                helpText={t("emailAsUsernameHelpText")}
                fieldLabelId="registrationEmailAsUsername"
              />
            }
            hasNoPaddingTop
          >
            <Switch
              id="kc-email-as-username-switch"
              data-testid="email-as-username-switch"
              value={realm.registrationEmailAsUsername ? "on" : "off"}
              label={t("on")}
              labelOff={t("off")}
              isChecked={realm.registrationEmailAsUsername}
              onChange={async (_event, value) => {
                await updateSwitchValue([
                  {
                    registrationEmailAsUsername: value,
                  },
                  {
                    duplicateEmailsAllowed: false,
                  },
                ]);
              }}
              aria-label={t("registrationEmailAsUsername")}
            />
          </FormGroup>
          <FormGroup
            label={t("loginWithEmailAllowed")}
            fieldId="kc-login-with-email"
            labelIcon={
              <HelpItem
                helpText={t("loginWithEmailHelpText")}
                fieldLabelId="loginWithEmailAllowed"
              />
            }
            hasNoPaddingTop
          >
            <Switch
              id="kc-login-with-email-switch"
              data-testid="login-with-email-switch"
              value={realm.loginWithEmailAllowed ? "on" : "off"}
              label={t("on")}
              labelOff={t("off")}
              isChecked={realm.loginWithEmailAllowed}
              onChange={async (_event, value) => {
                await updateSwitchValue([
                  {
                    loginWithEmailAllowed: value,
                  },
                  { duplicateEmailsAllowed: false },
                ]);
              }}
              aria-label={t("loginWithEmailAllowed")}
            />
          </FormGroup>
          <FormGroup
            label={t("duplicateEmailsAllowed")}
            fieldId="kc-duplicate-emails"
            labelIcon={
              <HelpItem
                helpText={t("duplicateEmailsHelpText")}
                fieldLabelId="duplicateEmailsAllowed"
              />
            }
            hasNoPaddingTop
          >
            <Switch
              id="kc-duplicate-emails-switch"
              data-testid="duplicate-emails-switch"
              label={t("on")}
              labelOff={t("off")}
              isChecked={realm.duplicateEmailsAllowed}
              onChange={async (_event, value) => {
                await updateSwitchValue({
                  duplicateEmailsAllowed: value,
                });
              }}
              isDisabled={
                realm.loginWithEmailAllowed || realm.registrationEmailAsUsername
              }
              aria-label={t("duplicateEmailsAllowed")}
            />
          </FormGroup>
          <FormGroup
            label={t("verifyEmail")}
            fieldId="kc-verify-email"
            labelIcon={
              <HelpItem
                helpText={t("verifyEmailHelpText")}
                fieldLabelId="verifyEmail"
              />
            }
            hasNoPaddingTop
          >
            <Switch
              id="kc-verify-email-switch"
              data-testid="verify-email-switch"
              name="verifyEmail"
              value={realm.verifyEmail ? "on" : "off"}
              label={t("on")}
              labelOff={t("off")}
              isChecked={realm.verifyEmail}
              onChange={async (_event, value) => {
                await updateSwitchValue({ verifyEmail: value });
              }}
              aria-label={t("verifyEmail")}
            />
          </FormGroup>
        </FormAccess>
      </FormPanel>
      <FormPanel
        className="kc-user-info-settings"
        title={t("userInfoSettings")}
      >
        <FormAccess isHorizontal role="manage-realm">
          <FormGroup
            label={t("editUsernameAllowed")}
            fieldId="kc-edit-username"
            labelIcon={
              <HelpItem
                helpText={t("editUsernameHelp")}
                fieldLabelId="editUsernameAllowed"
              />
            }
            hasNoPaddingTop
          >
            <Switch
              id="kc-edit-username-switch"
              data-testid="edit-username-switch"
              value={realm.editUsernameAllowed ? "on" : "off"}
              label={t("on")}
              labelOff={t("off")}
              isChecked={realm.editUsernameAllowed}
              onChange={async (_event, value) => {
                await updateSwitchValue({ editUsernameAllowed: value });
              }}
              aria-label={t("editUsernameAllowed")}
            />
          </FormGroup>
        </FormAccess>
      </FormPanel>
    </PageSection>
  );
};
