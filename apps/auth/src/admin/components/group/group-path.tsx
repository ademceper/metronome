/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/group/GroupPath.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useState } from "react";
type TableTextProps = any;

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";


const Tooltip = ({ content, children, ...props }: any) => <>{children}</>;

type GroupPathProps = TableTextProps & {
  group: GroupRepresentation;
};

export const GroupPath = ({
  group: { path },
  onMouseEnter: onMouseEnterProp,
  ...props
}: GroupPathProps) => {
  const [tooltip, setTooltip] = useState("");
  const onMouseEnter = (event: any) => {
    setTooltip(path!);
    onMouseEnterProp?.(event);
  };
  const text = (
    <span onMouseEnter={onMouseEnter} {...props}>
      {path}
    </span>
  );

  return tooltip !== "" ? (
    <Tooltip content={tooltip} isVisible>
      {text}
    </Tooltip>
  ) : (
    text
  );
};
