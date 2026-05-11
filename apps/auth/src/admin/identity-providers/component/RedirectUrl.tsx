/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/component/RedirectUrl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { HelpItem, useEnvironment } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/RealmContext";
import { addTrailingSlash } from "../../util";


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

export const RedirectUrl = ({ id }: { id: string }) => {
  const { environment } = useEnvironment();
  const { t } = useTranslation();

  const { realm } = useRealm();
  const callbackUrl = `${addTrailingSlash(
    environment.serverBaseUrl,
  )}realms/${realm}/broker`;

  return (
    <FormGroup
      label={t("redirectURI")}
      labelIcon={
        <HelpItem helpText={t("redirectURIHelp")} fieldLabelId="redirectURI" />
      }
      fieldId="kc-redirect-uri"
    >
      <ClipboardCopy
        isReadOnly
      >{`${callbackUrl}/${id}/endpoint`}</ClipboardCopy>
    </FormGroup>
  );
};
