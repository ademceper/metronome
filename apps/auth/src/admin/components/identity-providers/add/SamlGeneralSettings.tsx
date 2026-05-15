/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/SamlGeneralSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  HelpItem,
  TextControl,
  useEnvironment,
} from "../../../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormattedLink } from "../../external-link/FormattedLink";
import { useRealm } from "../../../context/realm-context/RealmContext";
import type { Environment } from "../../../environment";
import { DisplayOrder } from "../component/DisplayOrder";
import { RedirectUrl } from "../component/RedirectUrl";

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

type SamlGeneralSettingsProps = {
  isAliasReadonly?: boolean;
};

export const SamlGeneralSettings = ({
  isAliasReadonly = false,
}: SamlGeneralSettingsProps) => {
  const { t } = useTranslation();
  const { realm } = useRealm();
  const { environment } = useEnvironment<Environment>();

  const { control } = useFormContext();
  const alias = useWatch({ control, name: "alias" });

  return (
    <>
      <RedirectUrl id={alias} />

      <TextControl
        name="alias"
        label={t("alias")}
        labelIcon={t("aliasHelp")}
        readOnly={isAliasReadonly}
        rules={{
          required: t("required"),
        }}
      />

      <TextControl name="displayName" label={t("displayName")} />
      <DisplayOrder />
      {isAliasReadonly && (
        <FormGroup
          label={t("endpoints")}
          fieldId="endpoints"
          labelIcon={
            <HelpItem helpText={t("aliasHelp")} fieldLabelId="alias" />
          }
          className="keycloak__identity-providers__saml_link"
        >
          <FormattedLink
            title={t("samlEndpointsLabel")}
            href={`${environment.adminBaseUrl}/realms/${realm}/broker/${alias}/endpoint/descriptor`}
            isInline
          />
        </FormGroup>
      )}
    </>
  );
};
