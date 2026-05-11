/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/ExtendedOAuth2Settings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  NumberControl,
  SelectControl,
} from "../../../shared/keycloak-ui-shared";
import { Collapsible as UICollapsible, CollapsibleContent as UICollapsibleContent, CollapsibleTrigger as UICollapsibleTrigger } from "@metronome/ui/components/collapsible";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SwitchField } from "../component/SwitchField";
import { TextField } from "../component/TextField";


const ExpandableSection = ({ toggleText, toggleTextExpanded, toggleTextCollapsed, isExpanded, onToggle, isDetached, children, ...props }: any) => (
  <UICollapsible open={isExpanded} onOpenChange={(open: boolean) => onToggle?.(undefined, open)} {...props}>
    <UICollapsibleTrigger className="flex items-center gap-2 text-sm">
      {isExpanded ? (toggleTextExpanded ?? toggleText) : (toggleTextCollapsed ?? toggleText)}
    </UICollapsibleTrigger>
    <UICollapsibleContent>{children}</UICollapsibleContent>
  </UICollapsible>
);
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);

export const ExtendedOAuth2Settings = () => {
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ExpandableSection
      toggleText={t("advanced")}
      onToggle={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <Form isHorizontal>
        <TextField field="config.defaultScope" label="scopes" />
        <SelectControl
          name="config.prompt"
          label={t("prompt")}
          options={[
            { key: "", value: t("prompts.unspecified") },
            { key: "none", value: t("prompts.none") },
            { key: "consent", value: t("prompts.consent") },
            { key: "login", value: t("prompts.login") },
            { key: "select_account", value: t("prompts.select_account") },
          ]}
          controller={{ defaultValue: "" }}
        />
        <SwitchField
          field="config.acceptsPromptNoneForwardFromClient"
          label="acceptsPromptNone"
        />
        <SwitchField
          field="config.requiresShortStateParameter"
          label="requiresShortStateParameter"
        />
        <NumberControl
          name="config.allowedClockSkew"
          label={t("allowedClockSkew")}
          labelIcon={t("allowedClockSkewHelp")}
          controller={{ defaultValue: 0, rules: { min: 0 } }}
        />
        <TextField field="config.forwardParameters" label="forwardParameters" />
      </Form>
    </ExpandableSection>
  );
};
