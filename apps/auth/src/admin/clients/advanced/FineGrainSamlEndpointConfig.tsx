/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/advanced/FineGrainSamlEndpointConfig.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";

import { FormAccess } from "../../components/form/FormAccess";
import { TextControl } from "../../../shared/keycloak-ui-shared";
import { ApplicationUrls } from "./ApplicationUrls";


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

type FineGrainSamlEndpointConfigProps = {
  save: () => void;
  reset: () => void;
};

export const FineGrainSamlEndpointConfig = ({
  save,
  reset,
}: FineGrainSamlEndpointConfigProps) => {
  const { t } = useTranslation();
  return (
    <FormAccess role="manage-realm" isHorizontal>
      <ApplicationUrls />
      <TextControl
        name="attributes.saml_assertion_consumer_url_post"
        label={t("assertionConsumerServicePostBindingURL")}
        labelIcon={t("assertionConsumerServicePostBindingURLHelp")}
        type="url"
      />
      <TextControl
        name="attributes.saml_assertion_consumer_url_redirect"
        label={t("assertionConsumerServiceRedirectBindingURL")}
        labelIcon={t("assertionConsumerServiceRedirectBindingURLHelp")}
        type="url"
      />
      <TextControl
        name="attributes.saml_single_logout_service_url_post"
        label={t("logoutServicePostBindingURL")}
        labelIcon={t("logoutServicePostBindingURLHelp")}
        type="url"
      />
      <TextControl
        name="attributes.saml_single_logout_service_url_redirect"
        label={t("logoutServiceRedirectBindingURL")}
        labelIcon={t("logoutServiceRedirectBindingURLHelp")}
        type="url"
      />
      <TextControl
        name="attributes.saml_single_logout_service_url_soap"
        label={t("logoutServiceSoapBindingUrl")}
        labelIcon={t("logoutServiceSoapBindingUrlHelp")}
        type="url"
      />
      <TextControl
        name="attributes.saml_single_logout_service_url_artifact"
        label={t("logoutServiceArtifactBindingUrl")}
        labelIcon={t("logoutServiceArtifactBindingUrlHelp")}
        type="url"
      />
      <TextControl
        name="attributes.saml_artifact_binding_url"
        label={t("artifactBindingUrl")}
        labelIcon={t("artifactBindingUrlHelp")}
        type="url"
      />
      <TextControl
        name="attributes.saml_artifact_resolution_service_url"
        label={t("artifactResolutionService")}
        labelIcon={t("artifactResolutionServiceHelp")}
        type="url"
      />

      <ActionGroup>
        <Button variant="tertiary" onClick={save} data-testid="fineGrainSave">
          {t("save")}
        </Button>
        <Button variant="link" onClick={reset} data-testid="fineGrainRevert">
          {t("revert")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
