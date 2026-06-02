/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/JwksSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { DefaultSwitchControl } from "../../SwitchControl";
import { useTranslation } from "react-i18next";
import {
  TextAreaControl,
  TextControl,
  useAlerts,
} from "../../../../shared/keycloak-ui-shared";
import {
  ImportFile,
  ImportKeyDialog,
} from "../../clients/keys/ImportKeyDialog";
import useToggle from "../../../utils/use-toggle";
import { useAdminClient } from "../../../admin-client";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
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

type JwksSettingsProps = {
  readOnly?: boolean;
};

export const JwksSettings = ({ readOnly = false }: JwksSettingsProps) => {
  const { t } = useTranslation();
  const { control, setValue } =
    useFormContext<IdentityProviderRepresentation>();
  const { adminClient } = useAdminClient();
  const { addAlert, addError } = useAlerts();
  const [openImportKeys, toggleOpenImportKeys, setOpenImportKeys] = useToggle();
  const useJwks = useWatch({
    control,
    name: "config.useJwksUrl",
    defaultValue: "true",
  });
  const publicKeySignatureVerifier = useWatch({
    control,
    name: "config.publicKeySignatureVerifier",
  });

  const importKey = async (importFile: ImportFile) => {
    try {
      const formData = new FormData();
      const { file, ...rest } = importFile;

      for (const [key, value] of Object.entries(rest)) {
        formData.append(key, value);
      }

      formData.append("file", file);
      const info = await adminClient.identityProviders.uploadCertificate(
        {},
        formData,
      );
      if (info.jwks) {
        setValue("config.publicKeySignatureVerifier", info.jwks);
        setValue("config.publicKeySignatureVerifierKeyId", "");
        addAlert(t("importSuccess"), AlertVariant.success);
      } else if (info.publicKey) {
        setValue("config.publicKeySignatureVerifier", info.publicKey);
        addAlert(t("importSuccess"), AlertVariant.success);
      } else {
        addError("importError", t("emptyResources"));
      }
    } catch (error) {
      addError("importError", error);
    }
  };

  return (
    <>
      <DefaultSwitchControl
        name="config.useJwksUrl"
        label={t("useJwksUrl")}
        labelIcon={t("useJwksUrlHelp")}
        isDisabled={readOnly}
        defaultValue={"true"}
        stringify
      />
      {useJwks === "true" ? (
        <TextControl
          name="config.jwksUrl"
          label={t("jwksUrl")}
          labelIcon={t("jwksUrlHelp")}
          type="url"
          readOnly={readOnly}
          rules={{
            required: t("required"),
          }}
        />
      ) : (
        <>
          {openImportKeys && (
            <ImportKeyDialog
              toggleDialog={toggleOpenImportKeys}
              save={importKey}
              title="importKey"
              description="importKeysDescription"
            />
          )}
          {!publicKeySignatureVerifier?.trim().startsWith("{") && (
            <TextControl
              name="config.publicKeySignatureVerifierKeyId"
              label={t("validatingPublicKeyId")}
              labelIcon={t("validatingPublicKeyIdHelp")}
              readOnly={readOnly}
            />
          )}
          <TextAreaControl
            name="config.publicKeySignatureVerifier"
            label={t("validatingPublicKey")}
            labelIcon={t("validatingPublicKeyHelp")}
            rules={{ required: t("required") }}
            readOnly={readOnly}
          />
          {!readOnly && (
            <FormGroup fieldId="kc-import-certificate-button">
              <Button
                variant="secondary"
                data-testid="import-certificate-button"
                onClick={() => setOpenImportKeys(true)}
              >
                {t("import")}
              </Button>
            </FormGroup>
          )}
        </>
      )}
    </>
  );
};
