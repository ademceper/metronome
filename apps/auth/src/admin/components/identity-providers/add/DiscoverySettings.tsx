/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/DiscoverySettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import { Collapsible as UICollapsible, CollapsibleContent as UICollapsibleContent, CollapsibleTrigger as UICollapsibleTrigger } from "@metronome/ui/components/collapsible";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SelectControl, TextControl } from "../../../../shared/keycloak-ui-shared";
import { DefaultSwitchControl } from "../../SwitchControl";
import { JwksSettings } from "./JwksSettings";

const ExpandableSection = ({ toggleText, toggleTextExpanded, toggleTextCollapsed, isExpanded, onToggle, isDetached, children, ...props }: any) => (
  <UICollapsible open={isExpanded} onOpenChange={(open: boolean) => onToggle?.(undefined, open)} {...props}>
    <UICollapsibleTrigger className="flex items-center gap-2 text-sm">
      {isExpanded ? (toggleTextExpanded ?? toggleText) : (toggleTextCollapsed ?? toggleText)}
    </UICollapsibleTrigger>
    <UICollapsibleContent>{children}</UICollapsibleContent>
  </UICollapsible>
);

const PKCE_METHODS = ["plain", "S256"] as const;

type DiscoverySettingsProps = {
  readOnly: boolean;
  isOIDC: boolean;
};

const Fields = ({ readOnly, isOIDC }: DiscoverySettingsProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext<IdentityProviderRepresentation>();

  const validateSignature = useWatch({
    control,
    name: "config.validateSignature",
  });
  const isPkceEnabled = useWatch({
    control,
    name: "config.pkceEnabled",
  });
  const jwtAuthorizationGrantEnabled = useWatch({
    control,
    name: "config.jwtAuthorizationGrantEnabled",
  });
  const supportsClientAssertions = useWatch({
    control,
    name: "config.supportsClientAssertions",
  });

  return (
    <div className="pf-v5-c-form pf-m-horizontal">
      <TextControl
        name="config.authorizationUrl"
        label={t("authorizationUrl")}
        type="url"
        readOnly={readOnly}
        rules={{
          required: t("required"),
        }}
      />
      <TextControl
        name="config.tokenUrl"
        label={t("tokenUrl")}
        type="url"
        readOnly={readOnly}
        rules={{
          required: t("required"),
        }}
      />
      {isOIDC && (
        <TextControl
          name="config.logoutUrl"
          label={t("logoutUrl")}
          readOnly={readOnly}
        />
      )}
      <TextControl
        name="config.userInfoUrl"
        label={t("userInfoUrl")}
        readOnly={readOnly}
        rules={{
          required: isOIDC ? "" : t("required"),
        }}
      />
      <TextControl
        name="config.tokenIntrospectionUrl"
        label={t("tokenIntrospectionUrl")}
        type="url"
        readOnly={readOnly}
      />
      {isOIDC && (
        <TextControl
          name="config.issuer"
          label={t("issuer")}
          readOnly={readOnly}
        />
      )}
      {isOIDC && (
        <>
          <DefaultSwitchControl
            name="config.validateSignature"
            label={t("validateSignature")}
            labelIcon={t("validateSignatureHelp")}
            isDisabled={readOnly}
            stringify
          />
          {(validateSignature === "true" ||
            jwtAuthorizationGrantEnabled === "true" ||
            supportsClientAssertions == "true") && (
            <JwksSettings readOnly={readOnly} />
          )}
        </>
      )}
      <DefaultSwitchControl
        name="config.pkceEnabled"
        label={t("pkceEnabled")}
        isDisabled={readOnly}
        stringify
      />
      {isPkceEnabled === "true" && (
        <SelectControl
          name="config.pkceMethod"
          label={t("pkceMethod")}
          labelIcon={t("pkceMethodHelp")}
          controller={{
            defaultValue: PKCE_METHODS[0],
          }}
          options={PKCE_METHODS.map((option) => ({
            key: option,
            value: t(option),
          }))}
        />
      )}
    </div>
  );
};

export const DiscoverySettings = ({
  readOnly,
  isOIDC,
}: DiscoverySettingsProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {readOnly && (
        <ExpandableSection
          className="keycloak__discovery-settings__metadata"
          toggleText={isExpanded ? t("hideMetaData") : t("showMetaData")}
          onToggle={() => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}
        >
          <Fields readOnly={readOnly} isOIDC={isOIDC} />
        </ExpandableSection>
      )}
      {!readOnly && <Fields readOnly={readOnly} isOIDC={isOIDC} />}
    </>
  );
};
