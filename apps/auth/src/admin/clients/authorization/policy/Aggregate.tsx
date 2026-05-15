/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/Aggregate.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../../../shared/keycloak-ui-shared";
import { useParams } from "../../../utils/useParams";
import type { PolicyDetailsParams } from "../../paths/PolicyDetails";
import { DecisionStrategySelect } from "../DecisionStrategySelect";
import { ResourcesPolicySelect } from "../ResourcesPolicySelect";
import { NewPermissionPolicyDetailsParams } from "../../../permissions-configuration/paths/NewPermissionPolicy";


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

export const Aggregate = () => {
  const { t } = useTranslation();
  const { id } = useParams<PolicyDetailsParams>();
  const { permissionClientId } = useParams<NewPermissionPolicyDetailsParams>();

  return (
    <>
      <FormGroup
        label={t("applyPolicy")}
        fieldId="policies"
        labelIcon={
          <HelpItem helpText={t("applyPolicyHelp")} fieldLabelId="policies" />
        }
      >
        <ResourcesPolicySelect
          name="policies"
          clientId={permissionClientId || id}
        />
      </FormGroup>
      <DecisionStrategySelect helpLabel="policyDecisionStagey" />
    </>
  );
};
