/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/keys/SamlKeys.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type CertificateRepresentation from "@keycloak/keycloak-admin-client/lib/defs/certificateRepresentation";
import {
  FormPanel,
  HelpItem,
  useAlerts,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Card as UICard, CardContent as UICardContent } from "@metronome/ui/components/card";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { saveAs } from "file-saver";
import { Fragment, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { useConfirmDialog } from "../../confirm-dialog/confirm-dialog";
import { FormAccess } from "../../form/form-access";
import { convertAttributeNameToForm } from "../../../util";
import useToggle from "../../../utils/use-toggle";
import { FormFields } from "../client-details";
import { Certificate } from "./certificate";
import { ExportSamlKeyDialog } from "./export-saml-key-dialog";
import { SamlImportKeyDialog } from "./saml-import-key-dialog";
import { SamlKeysDialog } from "./saml-keys-dialog";


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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);

type SamlKeysProps = {
  clientId: string;
  save: () => void;
};

type KeyMapping = {
  name: string;
  title: string;
  key: string;
  regenerateKey: string;
  relatedKeys: string[];
};

const KEYS = ["saml.signing", "saml.encryption"] as const;
export type KeyTypes = (typeof KEYS)[number];

const KEYS_MAPPING: { [key in KeyTypes]: KeyMapping } = {
  "saml.signing": {
    name: convertAttributeNameToForm("attributes.saml.client.signature"),
    title: "signingKeysConfig",
    key: "clientSignature",
    regenerateKey: "reGenerateSigning",
    relatedKeys: [],
  },
  "saml.encryption": {
    name: convertAttributeNameToForm("attributes.saml.encrypt"),
    title: "encryptionKeysConfig",
    key: "encryptAssertions",
    regenerateKey: "reGenerateEncryption",
    relatedKeys: [
      convertAttributeNameToForm("attributes.saml.encryption.algorithm"),
      convertAttributeNameToForm("attributes.saml.encryption.keyAlgorithm"),
      convertAttributeNameToForm("attributes.saml.encryption.digestMethod"),
      convertAttributeNameToForm(
        "attributes.saml.encryption.maskGenerationFunction",
      ),
    ],
  },
};

type KeySectionProps = {
  clientId: string;
  keyInfo?: CertificateRepresentation;
  attr: KeyTypes;
  onChanged: (key: KeyTypes) => void;
  onGenerate: (key: KeyTypes, regenerate: boolean) => void;
  onImport: (key: KeyTypes) => void;
  save: () => void;
};

const KeySection = ({
  clientId,
  keyInfo,
  attr,
  onChanged,
  onGenerate,
  onImport,
  save,
}: KeySectionProps) => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<FormFields>();
  const title = KEYS_MAPPING[attr].title;
  const key = KEYS_MAPPING[attr].key;
  const name = KEYS_MAPPING[attr].name;

  const [showImportDialog, toggleImportDialog] = useToggle();

  const section = watch(name as keyof FormFields);

  const useMetadataDescriptorUrl = watch(
    convertAttributeNameToForm<FormFields>(
      "attributes.saml.useMetadataDescriptorUrl",
    ),
    "false",
  );

  return (
    <>
      {showImportDialog && (
        <ExportSamlKeyDialog
          keyType={attr}
          clientId={clientId}
          close={toggleImportDialog}
        />
      )}
      <FormPanel title={t(title)} className="kc-form-panel__panel">
        <TextContent className="pf-v5-u-pb-lg">
          <Text>{t(`${title}Explain`)}</Text>
        </TextContent>
        <FormAccess role="manage-clients" isHorizontal>
          <FormGroup
            labelIcon={
              <HelpItem helpText={t(`${key}Help`)} fieldLabelId={key} />
            }
            label={t(key)}
            fieldId={key}
            hasNoPaddingTop
          >
            <Controller
              name={name as keyof FormFields}
              control={control}
              defaultValue="false"
              render={({ field }) => (
                <Switch
                  data-testid={key}
                  id={key}
                  label={t("on")}
                  labelOff={t("off")}
                  isChecked={field.value === "true"}
                  onChange={(_event, value) => {
                    const v = value.toString();
                    if (v === "true" && useMetadataDescriptorUrl === "true") {
                      field.onChange(v);
                      save();
                    } else if (v === "true") {
                      onChanged(attr);
                      field.onChange(v);
                    } else {
                      onGenerate(attr, false);
                    }
                  }}
                  aria-label={t(key)}
                />
              )}
            />
          </FormGroup>
        </FormAccess>
      </FormPanel>
      {useMetadataDescriptorUrl !== "true" &&
        keyInfo?.certificate &&
        section === "true" && (
          <Card isFlat>
            <CardBody className="kc-form-panel__body">
              <Form isHorizontal>
                <Certificate
                  helpTextKey={`saml${key}CertificateHelp`}
                  keyInfo={keyInfo}
                />
                <ActionGroup>
                  <Button
                    variant="secondary"
                    onClick={() => onGenerate(attr, true)}
                  >
                    {t("regenerate")}
                  </Button>
                  <Button variant="secondary" onClick={() => onImport(attr)}>
                    {t("importKey")}
                  </Button>
                  <Button variant="tertiary" onClick={toggleImportDialog}>
                    {t("export")}
                  </Button>
                </ActionGroup>
              </Form>
            </CardBody>
          </Card>
        )}
    </>
  );
};

export const SamlKeys = ({ clientId, save }: SamlKeysProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const [isChanged, setIsChanged] = useState<KeyTypes>();
  const [keyInfo, setKeyInfo] = useState<CertificateRepresentation[]>();
  const [selectedType, setSelectedType] = useState<KeyTypes>();
  const [openImport, setImportOpen] = useState<KeyTypes>();
  const [refresh, setRefresh] = useState(0);

  const { setValue } = useFormContext();
  const { addAlert, addError } = useAlerts();

  useFetch(
    () =>
      Promise.all(
        KEYS.map((attr) =>
          adminClient.clients.getKeyInfo({ id: clientId, attr }),
        ),
      ),
    (info) => setKeyInfo(info),
    [refresh],
  );

  const generate = async (attr: KeyTypes) => {
    const index = KEYS.indexOf(attr);
    try {
      const info = [...(keyInfo || [])];
      info[index] = await adminClient.clients.generateKey({
        id: clientId,
        attr,
      });

      setKeyInfo(info);
      saveAs(
        new Blob([info[index].privateKey!], {
          type: "application/octet-stream",
        }),
        "private.key",
      );

      addAlert(t("generateSuccess"), AlertVariant.success);
    } catch (error) {
      addError("generateError", error);
    }
  };

  const key = selectedType ? KEYS_MAPPING[selectedType].key : "";
  const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
    titleKey: t("disableSigning", {
      key: t(key),
    }),
    messageKey: t("disableSigningExplain", {
      key: t(key),
    }),
    continueButtonLabel: "yes",
    cancelButtonLabel: "no",
    onConfirm: () => {
      setValue(KEYS_MAPPING[selectedType!].name, "false");
      for (const key of KEYS_MAPPING[selectedType!].relatedKeys) {
        setValue(key, ""); // remove related attributes when disabled
      }
      save();
    },
  });

  const regenerateKey = selectedType
    ? KEYS_MAPPING[selectedType].regenerateKey
    : "";
  const [toggleReGenerateDialog, ReGenerateConfirm] = useConfirmDialog({
    titleKey: regenerateKey,
    messageKey: regenerateKey + "Explain",
    continueButtonLabel: "yes",
    cancelButtonLabel: "no",
    onConfirm: async () => {
      await generate(selectedType!);
    },
  });

  return (
    <PageSection variant="light" className="keycloak__form">
      {isChanged && (
        <SamlKeysDialog
          id={clientId}
          attr={isChanged}
          localeKey={key}
          onClose={() => {
            setIsChanged(undefined);
            for (const key of KEYS_MAPPING[selectedType!].relatedKeys) {
              setValue(key, ""); // take defaults when enabled
            }
            save();
            setRefresh(refresh + 1);
          }}
          onCancel={() => {
            setValue(KEYS_MAPPING[selectedType!].name, "false");
            setIsChanged(undefined);
          }}
        />
      )}
      <DisableConfirm />
      <ReGenerateConfirm />
      {KEYS.map((attr, index) => (
        <Fragment key={attr}>
          {openImport === attr && (
            <SamlImportKeyDialog
              id={clientId}
              attr={attr}
              onClose={() => setImportOpen(undefined)}
              onImported={() => setRefresh(refresh + 1)}
            />
          )}
          <KeySection
            clientId={clientId}
            keyInfo={keyInfo?.[index]}
            attr={attr}
            onChanged={(type) => {
              setIsChanged(type);
              setSelectedType(type);
            }}
            onGenerate={(type, isNew) => {
              setSelectedType(type);
              if (!isNew) {
                toggleDisableDialog();
              } else {
                toggleReGenerateDialog();
              }
            }}
            onImport={() => setImportOpen(attr)}
            save={save}
          />
        </Fragment>
      ))}
    </PageSection>
  );
};
