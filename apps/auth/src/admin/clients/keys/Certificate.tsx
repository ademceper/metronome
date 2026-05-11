/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/keys/Certificate.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type CertificateRepresentation from "@keycloak/keycloak-admin-client/lib/defs/certificateRepresentation";
import { Textarea as UITextarea } from "@metronome/ui/components/textarea";
import { cn } from "@metronome/ui/lib/utils";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../../shared/keycloak-ui-shared";


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
const TextArea = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, ...props }: any) => (
  <UITextarea value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired} {...props} />
);

type CertificateProps = Omit<CertificateDisplayProps, "id"> & {
  plain?: boolean;
};

type CertificateDisplayProps = {
  id: string;
  helpTextKey?: string;
  type?: "jwks" | "certificate" | "publicKey";
  keyInfo?: CertificateRepresentation;
};

const CertificateDisplay = ({
  id,
  type = "certificate",
  keyInfo,
}: CertificateDisplayProps) => {
  const { t } = useTranslation();
  return (
    <TextArea
      readOnly
      rows={5}
      id={id}
      data-testid={type}
      value={keyInfo?.[type]}
      aria-label={t(type)}
    />
  );
};

export const Certificate = ({
  helpTextKey,
  type = "certificate",
  keyInfo,
  plain = false,
}: CertificateProps) => {
  const { t } = useTranslation();
  const id = useId();

  return plain ? (
    <CertificateDisplay id={id} type={type} keyInfo={keyInfo} />
  ) : (
    <FormGroup
      label={t(type)}
      fieldId={id}
      labelIcon={
        helpTextKey ? (
          <HelpItem helpText={t(helpTextKey)} fieldLabelId={id} />
        ) : undefined
      }
    >
      <CertificateDisplay id={id} type={type} keyInfo={keyInfo} />
    </FormGroup>
  );
};

export const KeyInfoArea = ({ type, keyInfo, ...rest }: CertificateProps) => {
  const myType = type
    ? type
    : keyInfo?.jwks
      ? "jwks"
      : keyInfo?.certificate
        ? "certificate"
        : "publicKey";
  return <Certificate type={myType} keyInfo={keyInfo} {...rest} />;
};
