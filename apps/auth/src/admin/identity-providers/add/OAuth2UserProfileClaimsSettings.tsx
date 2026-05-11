/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/OAuth2UserProfileClaimsSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useTranslation } from "react-i18next";
import { TextControl } from "../../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";

const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const TitleSizes = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;
const Title = ({ headingLevel = "h1", size, children, className, ...props }: any) =>
  React.createElement(headingLevel, {
    className: cn("font-heading font-medium", (TitleSizes as any)[size as string] ?? "text-base", className),
    ...props,
  }, children);

export const UserProfileClaimsSettings = () => {
  const { t } = useTranslation();

  return (
    <Form isHorizontal className="pf-v5-u-py-lg">
      <Title headingLevel="h2" size="xl" className="kc-form-panel__title">
        {t("userProfileClaims")}
      </Title>
      <TextControl
        name="config.userIDClaim"
        label={t("userIDClaim")}
        labelIcon={t("userIDClaimHelp")}
        rules={{
          required: t("required"),
        }}
        defaultValue={"sub"}
      />
      <TextControl
        name="config.userNameClaim"
        label={t("userNameClaim")}
        labelIcon={t("userNameClaimHelp")}
        rules={{
          required: t("required"),
        }}
        defaultValue={"preferred_username"}
      />
      <TextControl
        name="config.emailClaim"
        label={t("emailClaim")}
        labelIcon={t("emailClaimHelp")}
        rules={{
          required: t("required"),
        }}
        defaultValue={"email"}
      />
      <TextControl
        name="config.fullNameClaim"
        label={t("fullNameClaim")}
        labelIcon={t("fullNameClaimHelp")}
        defaultValue={"name"}
      />
      <TextControl
        name="config.givenNameClaim"
        label={t("givenNameClaim")}
        labelIcon={t("givenNameClaimHelp")}
        defaultValue={"given_name"}
      />
      <TextControl
        name="config.familyNameClaim"
        label={t("familyNameClaim")}
        labelIcon={t("familyNameClaimHelp")}
        defaultValue={"family_name"}
      />
    </Form>
  );
};
