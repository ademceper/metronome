/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/ClientSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import { cn } from "@metronome/ui/lib/utils";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollForm } from "../../../shared/keycloak-ui-shared";
import { ClientDescription } from "./ClientDescription";
import { FormFields } from "./ClientDetails";
import { AccessSettings } from "./add/AccessSettings";
import { CapabilityConfig } from "./add/CapabilityConfig";
import { LoginSettingsPanel } from "./add/LoginSettingsPanel";
import { LogoutPanel } from "./add/LogoutPanel";
import { SamlConfig } from "./add/SamlConfig";
import { SamlSignature } from "./add/SamlSignature";


const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);

export type ClientSettingsProps = {
  client: ClientRepresentation;
  save: () => void;
  reset: () => void;
};

export const ClientSettings = (props: ClientSettingsProps) => {
  const { t } = useTranslation();

  const { watch } = useFormContext<FormFields>();
  const protocol = watch("protocol");

  const { client } = props;

  return (
    <ScrollForm
      label={t("jumpToSection")}
      className="pf-v5-u-px-lg pf-v5-u-pb-lg"
      sections={[
        {
          title: t("generalSettings"),
          panel: (
            <Form isHorizontal>
              <ClientDescription
                protocol={client.protocol}
                hasConfigureAccess={client.access?.configure}
              />
            </Form>
          ),
        },
        {
          title: t("accessSettings"),
          panel: <AccessSettings {...props} />,
        },
        {
          title: t("samlCapabilityConfig"),
          isHidden: protocol !== "saml" || client.bearerOnly,
          panel: <SamlConfig />,
        },
        {
          title: t("signatureAndEncryption"),
          isHidden: protocol !== "saml" || client.bearerOnly,
          panel: <SamlSignature />,
        },
        {
          title: t("capabilityConfig"),
          isHidden: protocol !== "openid-connect" || client.bearerOnly,
          panel: <CapabilityConfig />,
        },
        {
          title: t("loginSettings"),
          isHidden: client.bearerOnly,
          panel: <LoginSettingsPanel access={client.access?.configure} />,
        },
        {
          title: t("logoutSettings"),
          isHidden: client.bearerOnly,
          panel: <LogoutPanel {...props} />,
        },
      ]}
    />
  );
};
