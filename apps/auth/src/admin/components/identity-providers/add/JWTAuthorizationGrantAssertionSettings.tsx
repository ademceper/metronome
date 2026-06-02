/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/JWTAuthorizationGrantAssertionSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { DefaultSwitchControl } from "../../SwitchControl";
import { cn } from "@metronome/ui/lib/utils";
import { useFormContext, Controller } from "react-hook-form";
import { TimeSelector } from "../../time-selector/TimeSelector";
import { SelectControl, HelpItem } from "../../../../shared/keycloak-ui-shared";
import { sortProviders } from "../../../util";
import { useServerInfo } from "../../../context/server-info/server-info-provider";


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

export const JWTAuthorizationGrantAssertionSettings = () => {
  const { t } = useTranslation();
  const providers = useServerInfo().providers!.signature.providers;
  const { control } = useFormContext();
  return (
    <>
      <DefaultSwitchControl
        name="config.jwtAuthorizationGrantAssertionReuseAllowed"
        label={t("jwtAuthorizationGrantAssertionReuseAllowed")}
        labelIcon={t("jwtAuthorizationGrantAssertionReuseAllowedHelp")}
        stringify
      />

      <FormGroup
        label={t("jwtAuthorizationGrantMaxAllowedAssertionExpiration")}
        fieldId="jwtAuthorizationGrantMaxAllowedAssertionExpiration"
        labelIcon={
          <HelpItem
            helpText={t(
              "jwtAuthorizationGrantMaxAllowedAssertionExpirationHelp",
            )}
            fieldLabelId="jwtAuthorizationGrantMaxAllowedAssertionExpiration"
          />
        }
      >
        <Controller
          name="config.jwtAuthorizationGrantMaxAllowedAssertionExpiration"
          defaultValue={300}
          control={control}
          render={({ field }) => (
            <TimeSelector
              data-testid="jwtAuthorizationGrantMaxAllowedAssertionExpiration"
              value={field.value!}
              onChange={field.onChange}
              units={["second", "minute", "hour"]}
            />
          )}
        />
      </FormGroup>
      <SelectControl
        name="config.jwtAuthorizationGrantAssertionSignatureAlg"
        label={t("jwtAuthorizationGrantAssertionSignatureAlg")}
        labelIcon={t("jwtAuthorizationGrantAssertionSignatureAlgHelp")}
        options={[
          { key: "", value: t("algorithmNotSpecified") },
          ...sortProviders(providers).map((p) => ({ key: p, value: p })),
        ]}
        controller={{
          defaultValue: "",
        }}
      />
      <DefaultSwitchControl
        name="config.jwtAuthorizationGrantLimitAccessTokenExp"
        label={t("jwtAuthorizationGrantLimitAccessTokenExp")}
        labelIcon={t("jwtAuthorizationGrantLimitAccessTokenExpHelp")}
        stringify
      />
    </>
  );
};
