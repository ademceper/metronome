/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/credentials/ClientSecret.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PasswordInput, HelpItem } from "../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { useAccess } from "../../context/access/Access";
import useFormatDate from "../../utils/useFormatDate";
import { CopyToClipboardButton } from "../../components/copy-to-clipboard-button/CopyToClipboardButton";


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
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);

export type ClientSecretProps = {
  client: ClientRepresentation;
  secret: string;
  toggle: () => void;
};

type SecretInputProps = ClientSecretProps & {
  id: string;
  buttonLabel: string;
};

const SecretInput = ({
  id,
  buttonLabel,
  client,
  secret,
  toggle,
}: SecretInputProps) => {
  const { t } = useTranslation();
  const form = useFormContext<ClientRepresentation>();
  const { hasAccess } = useAccess();
  const isManager = hasAccess("manage-clients") || client.access?.configure;

  return (
    <Split hasGutter>
      <SplitItem isFilled>
        <InputGroup>
          <InputGroupItem isFill>
            <Controller
              name="secret"
              control={form.control}
              render={({ field }) => (
                <PasswordInput id={id} {...field} isDisabled={!isManager} />
              )}
            />
          </InputGroupItem>
          <InputGroupItem>
            <CopyToClipboardButton
              id={id}
              text={secret}
              label="clientSecret"
              variant="control"
            />
          </InputGroupItem>
        </InputGroup>
      </SplitItem>
      <SplitItem>
        <Button
          variant="secondary"
          isDisabled={form.formState.isDirty || !isManager}
          onClick={toggle}
        >
          {t(buttonLabel)}
        </Button>
      </SplitItem>
    </Split>
  );
};

const ExpireDateFormatter = ({ time }: { time: number }) => {
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const unixTimeToString = (time: number) =>
    time
      ? t("secretExpiresOn", {
          time: formatDate(new Date(time * 1000), {
            dateStyle: "full",
            timeStyle: "long",
          }),
        })
      : undefined;

  return <div className="pf-v5-u-my-md">{unixTimeToString(time)}</div>;
};

export const ClientSecret = ({ client, secret, toggle }: ClientSecretProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const [secretRotated, setSecretRotated] = useState<string | undefined>(
    client.attributes?.["client.secret.rotated"],
  );
  const secretExpirationTime: number =
    client.attributes?.["client.secret.expiration.time"];
  const secretRotatedExpirationTime: number =
    client.attributes?.["client.secret.rotated.expiration.time"];

  const expired = (time: number) => new Date().getTime() >= time * 1000;

  const [toggleInvalidateConfirm, InvalidateConfirm] = useConfirmDialog({
    titleKey: "invalidateRotatedSecret",
    messageKey: "invalidateRotatedSecretExplain",
    continueButtonLabel: "confirm",
    onConfirm: async () => {
      try {
        await adminClient.clients.invalidateSecret({
          id: client.id!,
        });
        setSecretRotated(undefined);
        addAlert(t("invalidateRotatedSuccess"));
      } catch (error) {
        addError("invalidateRotatedError", error);
      }
    },
  });

  useEffect(() => {
    if (secretRotated !== client.attributes?.["client.secret.rotated"]) {
      setSecretRotated(client.attributes?.["client.secret.rotated"]);
    }
  }, [client, secretRotated]);

  return (
    <>
      <InvalidateConfirm />
      <FormGroup
        label={t("clientSecret")}
        fieldId="kc-client-secret"
        className="pf-v5-u-my-md"
        labelIcon={
          <HelpItem
            helpText={t("oidcClientSecretHelp")}
            fieldLabelId="kc-client-secret"
          />
        }
      >
        <SecretInput
          id="kc-client-secret"
          client={client}
          secret={secret}
          toggle={toggle}
          buttonLabel="regenerate"
        />
        <ExpireDateFormatter time={secretExpirationTime} />
        {expired(secretExpirationTime) && (
          <Alert variant="warning" isInline title={t("secretHasExpired")} />
        )}
      </FormGroup>
      {secretRotated && (
        <FormGroup label={t("secretRotated")} fieldId="secretRotated">
          <SecretInput
            id="secretRotated"
            client={client}
            secret={secretRotated}
            toggle={toggleInvalidateConfirm}
            buttonLabel="invalidateSecret"
          />
          <ExpireDateFormatter time={secretRotatedExpirationTime} />
        </FormGroup>
      )}
    </>
  );
};
