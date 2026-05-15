/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/components/diagram/ConditionalNode.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { memo } from "react";
import { Handle, Position } from "reactflow";

type ConditionalNodeProps = {
  data: { label: string };
  selected: boolean;
};

const ConditionalNodeInner = ({ data, selected }: ConditionalNodeProps) => {
  return (
    <>
      <Handle position={Position.Right} type="source" />
      <div
        className={`react-flow__node-default keycloak__authentication__conditional_node ${
          selected ? "selected" : ""
        }`}
      >
        <div>{data.label}</div>
      </div>
      <Handle position={Position.Left} type="target" />
    </>
  );
};

export const ConditionalNode = memo(ConditionalNodeInner);
