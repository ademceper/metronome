/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/FederatedUserLink.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { useFetch } from "../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminClient } from "../admin-client";
import { useAccess } from "../context/access/Access";
import { useRealm } from "../context/realm-context/RealmContext";
import { toCustomUserFederation } from "../lib/user-federation";


const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};

type FederatedUserLinkProps = {
  user: UserRepresentation;
};

export const FederatedUserLink = ({ user }: FederatedUserLinkProps) => {
  const { adminClient } = useAdminClient();

  const access = useAccess();
  const { realm } = useRealm();

  const [component, setComponent] = useState<ComponentRepresentation>();

  useFetch(
    () =>
      access.hasAccess("view-realm")
        ? adminClient.components.findOne({
            id: user.federationLink!,
          })
        : adminClient.userStorageProvider.name({
            id: user.federationLink!,
          }),
    setComponent,
    [],
  );

  if (!component) return null;

  if (!access.hasAccess("view-realm")) return <span>{component.name}</span>;

  return (
    <Button
      variant="link"
      component={(props) => (
        <Link
          {...props}
          to={toCustomUserFederation({
            id: component.id!,
            providerId: component.providerId!,
            realm,
          })}
        />
      )}
    >
      {component.name}
    </Button>
  );
};
