/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/keys/Keys.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type CertificateRepresentation from "@keycloak/keycloak-admin-client/lib/defs/certificateRepresentation";
import type KeyStoreConfig from "@keycloak/keycloak-admin-client/lib/defs/keystoreConfig";
import {
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Card as UICard, CardContent as UICardContent, CardHeader as UICardHeader, CardTitle as UICardTitle } from "@metronome/ui/components/card";
import { cn } from "@metronome/ui/lib/utils";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { FormAccess } from "../../form/form-access";
import { DefaultSwitchControl } from "../../switch-control";
import { convertAttributeNameToForm } from "../../../util";
import useToggle from "../../../utils/use-toggle";
import { FormFields } from "../client-details";
import { KeyInfoArea } from "./certificate";
import { GenerateKeyDialog, getFileExtension } from "./generate-key-dialog";
import { ImportFile, ImportKeyDialog } from "./import-key-dialog";


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
const Card = ({ isSelectable, isSelected, isFlat, isCompact, ...props }: any) => (
  <UICard {...props} />
);
const CardBody = (props: any) => <UICardContent {...props} />;
const CardHeader = (props: any) => <UICardHeader {...props} />;
const CardTitle = (props: any) => <UICardTitle {...props} />;
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);

type KeysProps = {
  save: () => void;
  refresh: () => void;
  clientId: string;
  hasConfigureAccess?: boolean;
};

const attr = "jwt.credential";

export const Keys = ({
  clientId,
  save,
  refresh: refreshParent,
  hasConfigureAccess,
}: KeysProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const {
    control,
    getValues,
    formState: { isDirty },
  } = useFormContext<FormFields>();
  const { addAlert, addError } = useAlerts();

  const [keyInfo, setKeyInfo] = useState<CertificateRepresentation>();
  const [openGenerateKeys, toggleOpenGenerateKeys, setOpenGenerateKeys] =
    useToggle();
  const [openImportKeys, toggleOpenImportKeys, setOpenImportKeys] = useToggle();
  const [key, setKey] = useState(0);
  const refresh = () => {
    setKey(key + 1);
    refreshParent();
  };

  const useJwksUrl = useWatch({
    control,
    name: convertAttributeNameToForm<FormFields>("attributes.use.jwks.url"),
    defaultValue: "false",
  });

  useFetch(
    async () => {
      try {
        return await adminClient.clients.getKeyInfo({ id: clientId, attr });
      } catch (error) {
        addError("getKeyInfoError", error);
        return {} as CertificateRepresentation;
      }
    },
    (info) => setKeyInfo(info),
    [key],
  );

  const generate = async (config: KeyStoreConfig) => {
    try {
      const keyStore = await adminClient.clients.generateAndDownloadKey(
        {
          id: clientId,
          attr,
        },
        config,
      );
      saveAs(
        new Blob([keyStore], { type: "application/octet-stream" }),
        `keystore.${getFileExtension(config.format ?? "")}`,
      );
      addAlert(t("generateSuccess"), AlertVariant.success);
      refresh();
    } catch (error) {
      addError("generateError", error);
    }
  };

  const importKey = async (importFile: ImportFile) => {
    try {
      const formData = new FormData();
      const { file, ...rest } = importFile;

      for (const [key, value] of Object.entries(rest)) {
        formData.append(key, value);
      }

      formData.append("file", file);
      await adminClient.clients.uploadCertificate(
        { id: clientId, attr },
        formData,
      );
      addAlert(t("importSuccess"), AlertVariant.success);
      refresh();
    } catch (error) {
      addError("importError", error);
    }
  };

  return (
    <PageSection variant="light" className="keycloak__form">
      {openGenerateKeys && (
        <GenerateKeyDialog
          clientId={getValues("clientId")!}
          toggleDialog={toggleOpenGenerateKeys}
          save={generate}
        />
      )}
      {openImportKeys && (
        <ImportKeyDialog toggleDialog={toggleOpenImportKeys} save={importKey} />
      )}
      <Card isFlat>
        <CardHeader>
          <CardTitle>{t("jwksUrlConfig")}</CardTitle>
        </CardHeader>
        <CardBody>
          <TextContent>
            <Text>{t("keysIntro")}</Text>
          </TextContent>
        </CardBody>
        <CardBody>
          <FormAccess
            role="manage-clients"
            fineGrainedAccess={hasConfigureAccess}
            isHorizontal
          >
            <DefaultSwitchControl
              name={convertAttributeNameToForm("attributes.use.jwks.url")}
              label={t("useJwksUrl")}
              labelIcon={t("useJwksUrlHelp")}
              stringify
            />
            {useJwksUrl !== "true" &&
              (keyInfo ? (
                <KeyInfoArea keyInfo={keyInfo} />
              ) : (
                "No public key configured"
              ))}
            {useJwksUrl === "true" && (
              <TextControl
                name={convertAttributeNameToForm("attributes.jwks.url")}
                label={t("jwksUrl")}
                labelIcon={t("jwksUrlHelp")}
                type="url"
              />
            )}
            <ActionGroup>
              <Button
                data-testid="saveKeys"
                onClick={save}
                isDisabled={!isDirty}
              >
                {t("save")}
              </Button>
              <Button
                data-testid="generate"
                variant="secondary"
                onClick={() => setOpenGenerateKeys(true)}
              >
                {t("generateNewKeys")}
              </Button>
              <Button
                data-testid="import"
                variant="secondary"
                onClick={() => setOpenImportKeys(true)}
                isDisabled={useJwksUrl === "true"}
              >
                {t("import")}
              </Button>
            </ActionGroup>
          </FormAccess>
        </CardBody>
      </Card>
    </PageSection>
  );
};
