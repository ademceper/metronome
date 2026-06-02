/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/credentials/SignedJWT.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { SelectControl } from "../../../../shared/keycloak-ui-shared";
import { useServerInfo } from "../../../context/server-info/server-info-provider";
import { convertAttributeNameToForm } from "../../../util";
import { FormFields } from "../ClientDetails";
import { TimeSelector } from "../../time-selector/TimeSelector";
import { cn } from "@metronome/ui/lib/utils";
import { HelpItem } from "../../../../shared/keycloak-ui-shared";


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

type SignedJWTProps = {
  clientAuthenticatorType: string;
};

export const SignedJWT = ({ clientAuthenticatorType }: SignedJWTProps) => {
  const { cryptoInfo } = useServerInfo();
  const providers =
    clientAuthenticatorType === "client-jwt"
      ? (cryptoInfo?.clientSignatureAsymmetricAlgorithms ?? [])
      : (cryptoInfo?.clientSignatureSymmetricAlgorithms ?? []);

  const { t } = useTranslation();
  const { control } = useFormContext<FormFields>();

  return (
    <>
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.token.endpoint.auth.signing.alg",
        )}
        label={t("signatureAlgorithm")}
        labelIcon={t("signatureAlgorithmHelp")}
        controller={{
          defaultValue: "",
        }}
        isScrollable
        maxMenuHeight="200px"
        options={[
          { key: "", value: t("anyAlgorithm") },
          ...providers.map((option) => ({ key: option, value: option })),
        ]}
      />
      <FormGroup
        label={t("signatureMaxExp")}
        fieldId="signatureMaxExp"
        className="pf-v5-u-my-md"
        labelIcon={
          <HelpItem
            helpText={t("signatureMaxExpHelp")}
            fieldLabelId="signatureMaxExp"
          />
        }
      >
        <Controller
          name={convertAttributeNameToForm<FormFields>(
            "attributes.token.endpoint.auth.signing.max.exp",
          )}
          defaultValue=""
          control={control}
          render={({ field }) => (
            <TimeSelector
              value={field.value!}
              onChange={field.onChange}
              units={["second", "minute"]}
              min="1"
            />
          )}
        />
      </FormGroup>
    </>
  );
};
