/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/UrlComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { FormGroup } from "../../../shared/@patternfly/react-core";
import { useTranslation } from "react-i18next";

import { HelpItem } from "../../../shared/keycloak-ui-shared";
import { useFormContext, useWatch } from "react-hook-form";
import type { ComponentProps } from "./components";
import { FormattedLink } from "../external-link/FormattedLink";

import "./url-component.css";

export const UrlComponent = ({ name, label, helpText }: ComponentProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { value } = useWatch({
    control,
    name: name!,
    defaultValue: "",
  });

  return (
    <FormGroup
      label={t(label!)}
      fieldId={name!}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId={`${label}`} />}
      className="keycloak__identity-providers__url_component"
    >
      <FormattedLink title={t(helpText!)} href={value} isInline />
    </FormGroup>
  );
};
