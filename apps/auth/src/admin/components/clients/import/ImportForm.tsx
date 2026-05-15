/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/import/ImportForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { fetchWithError } from "@keycloak/keycloak-admin-client";
import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  FormSubmitButton,
  TextControl,
} from "../../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../form/FormAccess";
import { FileUploadForm } from "../../json-file-upload/FileUploadForm";
import { ViewHeader } from "../../view-header/ViewHeader";
import { useRealm } from "../../../context/realm-context/RealmContext";
import {
  addTrailingSlash,
  convertFormValuesToObject,
  convertToFormValues,
} from "../../../util";
import { getAuthorizationHeaders } from "../../../utils/getAuthorizationHeaders";
import { ClientDescription } from "../ClientDescription";
import { FormFields } from "../ClientDetails";
import { CapabilityConfig } from "../add/CapabilityConfig";
import { toClient } from "../../../lib/clients";
import { toClients } from "../../../lib/clients";


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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

const isXml = (text: string) => text.match(/(<.[^(><.)]+>)/g);

export default function ImportForm() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { realm } = useRealm();
  const form = useForm<FormFields>();
  const { handleSubmit, setValue, formState } = form;
  const [imported, setImported] = useState<ClientRepresentation>({});

  const { addAlert, addError } = useAlerts();

  const handleFileChange = async (contents: string) => {
    try {
      const parsed = await parseFileContents(contents);

      convertToFormValues(parsed, setValue);
      setImported(parsed);
    } catch (error) {
      addError("importParseError", error);
    }
  };

  async function parseFileContents(
    contents: string,
  ): Promise<ClientRepresentation> {
    if (!isXml(contents)) {
      return JSON.parse(contents);
    }

    const response = await fetchWithError(
      `${addTrailingSlash(
        adminClient.baseUrl,
      )}admin/realms/${realm}/client-description-converter`,
      {
        method: "POST",
        body: contents,
        headers: getAuthorizationHeaders(await adminClient.getAccessToken()),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Server responded with invalid status: ${response.statusText}`,
      );
    }

    return response.json();
  }

  const save = async (client: ClientRepresentation) => {
    try {
      const newClient = await adminClient.clients.create({
        ...imported,
        ...convertFormValuesToObject({
          ...client,
          attributes: client.attributes || {},
        }),
      });
      addAlert(t("clientImportSuccess"), AlertVariant.success);
      navigate(toClient({ realm, clientId: newClient.id, tab: "settings" }));
    } catch (error) {
      addError("clientImportError", error);
    }
  };

  return (
    <>
      <ViewHeader titleKey="importClient" subKey="clientsExplain" />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          onSubmit={handleSubmit(save)}
          role="manage-clients"
        >
          <FormProvider {...form}>
            <FileUploadForm
              id="realm-file"
              language="json"
              extension=".json,.xml"
              helpText={t("helpFileUploadClient")}
              onChange={handleFileChange}
            />
            <ClientDescription hasConfigureAccess />
            <TextControl name="protocol" label={t("type")} readOnly />
            <CapabilityConfig unWrap={true} />
            <ActionGroup>
              <FormSubmitButton
                formState={formState}
                allowInvalid
                allowNonDirty
              >
                {t("save")}
              </FormSubmitButton>
              <Button
                variant="link"
                component={(props) => (
                  <Link {...props} to={toClients({ realm })} />
                )}
              >
                {t("cancel")}
              </Button>
            </ActionGroup>
          </FormProvider>
        </FormAccess>
      </PageSection>
    </>
  );
}
