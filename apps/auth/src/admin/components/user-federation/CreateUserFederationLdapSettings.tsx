/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/CreateUserFederationLdapSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/realm-context";
import {
  LdapComponentRepresentation,
  UserFederationLdapForm,
  serializeFormData,
} from "./UserFederationLdapForm";
import { toUserFederation } from "../../lib/user-federation";
import { ExtendedHeader } from "./shared/ExtendedHeader";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export default function CreateUserFederationLdapSettings() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<LdapComponentRepresentation>({ mode: "onChange" });
  const navigate = useNavigate();
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();

  const onSubmit = async (formData: LdapComponentRepresentation) => {
    try {
      await adminClient.components.create(serializeFormData(formData));
      addAlert(t("createUserProviderSuccess"), AlertVariant.success);
      navigate(toUserFederation({ realm }));
    } catch (error) {
      addError("createUserProviderError", error);
    }
  };

  return (
    <FormProvider {...form}>
      <ExtendedHeader
        provider="LDAP"
        noDivider
        save={() => form.handleSubmit(onSubmit)()}
      />
      <PageSection variant="light" className="pf-v5-u-p-0">
        <PageSection variant="light">
          <UserFederationLdapForm onSubmit={onSubmit} />
        </PageSection>
      </PageSection>
    </FormProvider>
  );
}
