/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/credentials/Credentials.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type { AuthenticationProviderRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigRepresentation";
import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type CredentialRepresentation from "@keycloak/keycloak-admin-client/lib/defs/credentialRepresentation";
import {
  HelpItem,
  SelectControl,
  useAlerts,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Card as UICard, CardContent as UICardContent } from "@metronome/ui/components/card";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { useConfirmDialog } from "../../confirm-dialog/ConfirmDialog";
import { DynamicComponents } from "../../dynamic/DynamicComponents";
import { FormAccess } from "../../form/FormAccess";
import { useServerInfo } from "../../../context/server-info/server-info-provider";
import { FormFields } from "../ClientDetails";
import { ClientSecret } from "./ClientSecret";
import { SignedJWT } from "./SignedJWT";
import { X509 } from "./X509";
import { convertAttributeNameToForm } from "../../../util";


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
const Card = ({ isSelectable, isSelected, isFlat, isCompact, ...props }: any) => (
  <UICard {...props} />
);
const CardBody = (props: any) => <UICardContent {...props} />;
const ClipboardCopy = ({ value, onChange, isReadOnly, isCode, hoverTip, clickTip, children, variant, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);
  const text = value ?? children ?? "";
  return (
    <div className="flex items-stretch gap-0">
      <UIInput readOnly={isReadOnly} value={String(text)}
        onChange={(e: any) => onChange?.(e, e.target.value)} className="rounded-r-none" />
      <UIButton type="button" variant="outline" className="rounded-l-none"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(String(text));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}>
        {copied ? (clickTip ?? "Copied") : (hoverTip ?? "Copy")}
      </UIButton>
    </div>
  );
};
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
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
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);

type AccessToken = {
  registrationAccessToken: string;
};

export type CredentialsProps = {
  client: ClientRepresentation;
  save: () => void;
  refresh: () => void;
};

export const Credentials = ({ client, save, refresh }: CredentialsProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const clientId = client.id!;

  const [providers, setProviders] = useState<
    AuthenticationProviderRepresentation[]
  >([]);

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
  } = useFormContext<FormFields>();

  const clientAuthenticatorType = useWatch({
    control: control,
    name: "clientAuthenticatorType",
    defaultValue: "",
  });

  const [secret, setSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const selectedProvider = providers.find(
    (provider) => provider.id === clientAuthenticatorType,
  );

  const { componentTypes } = useServerInfo();
  const providerProperties = useMemo(
    () =>
      componentTypes?.["org.keycloak.authentication.ClientAuthenticator"]?.find(
        (p) => p.id === clientAuthenticatorType,
      )?.clientProperties,
    [clientAuthenticatorType, componentTypes],
  );

  useFetch(
    () =>
      Promise.all([
        adminClient.authenticationManagement.getClientAuthenticatorProviders(),
        adminClient.clients.getClientSecret({
          id: clientId,
        }),
      ]),
    ([providers, secret]) => {
      setProviders(providers);
      setSecret(secret.value!);
    },
    [],
  );

  async function regenerate<T>(
    call: (clientId: string) => Promise<T>,
    message: string,
  ): Promise<T | undefined> {
    try {
      const data = await call(clientId);
      addAlert(t(`${message}Success`), AlertVariant.success);
      return data;
    } catch (error) {
      addError(`${message}Error`, error);
    }
  }

  const regenerateClientSecret = async () => {
    const secret = await regenerate<CredentialRepresentation>(
      (clientId) =>
        adminClient.clients.generateNewClientSecret({ id: clientId }),
      "clientSecret",
    );
    setSecret(secret?.value || "");
    refresh();
  };

  const [toggleClientSecretConfirm, ClientSecretConfirm] = useConfirmDialog({
    titleKey: "confirmClientSecretTitle",
    messageKey: "confirmClientSecretBody",
    continueButtonLabel: "yes",
    cancelButtonLabel: "no",
    onConfirm: regenerateClientSecret,
  });

  const regenerateAccessToken = async () => {
    const accessToken = await regenerate<AccessToken>(
      (clientId) =>
        adminClient.clients.generateRegistrationAccessToken({ id: clientId }),
      "accessToken",
    );
    setAccessToken(accessToken?.registrationAccessToken || "");
  };

  const [toggleAccessTokenConfirm, AccessTokenConfirm] = useConfirmDialog({
    titleKey: "confirmAccessTokenTitle",
    messageKey: "confirmAccessTokenBody",
    continueButtonLabel: "yes",
    cancelButtonLabel: "no",
    onConfirm: regenerateAccessToken,
  });

  return (
    <PageSection>
      <FormAccess
        onSubmit={handleSubmit(save)}
        isHorizontal
        className="pf-v5-u-mt-md"
        role="manage-clients"
        fineGrainedAccess={client.access?.configure}
      >
        <ClientSecretConfirm />
        <AccessTokenConfirm />
        <Card isFlat>
          <CardBody>
            <SelectControl
              name="clientAuthenticatorType"
              label={t("clientAuthenticator")}
              labelIcon={t("clientAuthenticatorTypeHelp")}
              controller={{
                defaultValue: "",
              }}
              options={providers.map(({ id, displayName }) => ({
                key: id!,
                value: displayName || id!,
              }))}
            />
            {clientAuthenticatorType === "client-secret" && (
              <SelectControl
                name={convertAttributeNameToForm<FormFields>(
                  "attributes.client.secret.authentication.allowed.method",
                )}
                label={t("clientSecretAuthenticationAllowedMethod")}
                labelIcon={t("clientSecretAuthenticationAllowedMethodHelp")}
                controller={{
                  defaultValue: "",
                }}
                isScrollable
                maxMenuHeight="200px"
                options={[
                  { key: "", value: t("any") },
                  { key: "client_secret_basic", value: "client_secret_basic" },
                  { key: "client_secret_post", value: "client_secret_post" },
                ]}
              />
            )}
            {(clientAuthenticatorType === "client-jwt" ||
              clientAuthenticatorType === "client-secret-jwt") && (
              <SignedJWT clientAuthenticatorType={clientAuthenticatorType} />
            )}
            {clientAuthenticatorType === "client-jwt" && (
              <FormGroup>
                <Alert variant="info" isInline title={t("signedJWTConfirm")} />
              </FormGroup>
            )}
            {clientAuthenticatorType === "client-x509" && <X509 />}
            {providerProperties && (
              <Form>
                <DynamicComponents
                  properties={providerProperties}
                  convertToName={(name) =>
                    convertAttributeNameToForm(`attributes.${name}`)
                  }
                />
              </Form>
            )}
            {selectedProvider?.supportsSecret && (
              <ClientSecret
                client={client}
                secret={secret}
                toggle={toggleClientSecretConfirm}
              />
            )}
            <ActionGroup>
              <Button variant="primary" type="submit" isDisabled={!isDirty}>
                {t("save")}
              </Button>
              <Button variant="link" onClick={() => reset()}>
                {t("revert")}
              </Button>
            </ActionGroup>
          </CardBody>
        </Card>
        <Card isFlat>
          <CardBody>
            <FormGroup
              label={t("registrationAccessToken")}
              fieldId="kc-access-token"
              labelIcon={
                <HelpItem
                  helpText={t("registrationAccessTokenHelp")}
                  fieldLabelId="registrationAccessToken"
                />
              }
            >
              <Split hasGutter>
                <SplitItem isFilled>
                  <ClipboardCopy id="kc-access-token" isReadOnly>
                    {accessToken}
                  </ClipboardCopy>
                </SplitItem>
                <SplitItem>
                  <Button
                    variant="secondary"
                    onClick={toggleAccessTokenConfirm}
                  >
                    {t("regenerate")}
                  </Button>
                </SplitItem>
              </Split>
            </FormGroup>
          </CardBody>
        </Card>
      </FormAccess>
    </PageSection>
  );
};
