/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/external-link/FormattedLink.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { ExternalLinkAltIcon } from "../../../shared/@patternfly/react-icons";
import { AnchorHTMLAttributes } from "react";

export type FormattedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  isInline?: boolean;
};

export const FormattedLink = ({
  title,
  href,
  isInline,
  ...rest
}: FormattedLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      style={{
        textDecoration: "underline",
        textDecorationColor: "transparent",
      }}
      className={isInline ? "pf-m-link pf-m-inline" : ""}
      {...rest}
    >
      {title ? title : href}{" "}
      {href?.startsWith("http") && <ExternalLinkAltIcon />}
    </a>
  );
};
