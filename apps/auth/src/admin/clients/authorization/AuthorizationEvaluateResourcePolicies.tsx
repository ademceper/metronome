/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/AuthorizationEvaluateResourcePolicies.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type EvaluationResultRepresentation from "@keycloak/keycloak-admin-client/lib/defs/evaluationResultRepresentation";
import { DecisionEffect } from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import type PolicyResultRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyResultRepresentation";
import { cn } from "@metronome/ui/lib/utils";
import {
  TableBody as Tbody,
  TableCell as Td,
  TableRow as Tr,
} from "@metronome/ui/components/table";
const ExpandableRowContent = ({ children }: any) => <>{children}</>;
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useRealm } from "../../context/realm-context/RealmContext";
import { useParams } from "../../utils/useParams";
import type { ClientParams } from "../routes/Client";
import { toPermissionDetails } from "../routes/PermissionDetails";
import { toPolicyDetails } from "../routes/PolicyDetails";


const capitalize = (s: string): string =>
  typeof s === "string" && s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const DescriptionList = ({ isHorizontal, columnModifier, children, ...props }: any) => (
  <dl className={cn("grid gap-y-2 text-sm",
    isHorizontal && "grid-cols-[max-content_1fr] gap-x-4",
    (props as any).className)} {...props}>
    {children}
  </dl>
);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextList = ({ component = "ul", children, ...props }: any) =>
  React.createElement(component, {
    className: cn(component === "ol" ? "list-decimal pl-5" : component === "dl" ? "" : "list-disc pl-5", "space-y-1 text-sm"),
    ...props,
  }, children);
const TextListItem = ({ component = "li", children, ...props }: any) =>
  React.createElement(component, props, children);

type Props = {
  idx: number;
  rowIndex: number;
  outerPolicy: PolicyResultRepresentation;
  resource: EvaluationResultRepresentation;
};

export const AuthorizationEvaluateResourcePolicies = ({
  idx,
  rowIndex,
  outerPolicy,
  resource,
}: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { t } = useTranslation();
  const { realm } = useRealm();
  const { clientId } = useParams<ClientParams>();

  return (
    <Tbody key={idx} isExpanded={expanded}>
      <Tr>
        <Td
          expand={{
            rowIndex,
            isExpanded: expanded,
            onToggle: () => setExpanded((prev) => !prev),
          }}
        />
        <Td data-testid={`name-column-${resource.resource}`}>
          <Link
            to={toPermissionDetails({
              realm,
              id: clientId,
              permissionType: outerPolicy.policy?.type!,
              permissionId: outerPolicy.policy?.id!,
            })}
          >
            {outerPolicy.policy?.name}
          </Link>
        </Td>
        <Td id={outerPolicy.status?.toLowerCase()}>
          {t(outerPolicy.status?.toLowerCase() as string)}
        </Td>
        <Td>{t(`${outerPolicy.policy?.decisionStrategy?.toLowerCase()}`)}</Td>
        <Td>
          {outerPolicy.status === DecisionEffect.Permit
            ? resource.policies?.[rowIndex]?.scopes?.join(", ")
            : "-"}
        </Td>
        <Td>
          {outerPolicy.status === DecisionEffect.Deny &&
          resource.policies?.[rowIndex]?.scopes?.length
            ? resource.policies[rowIndex].scopes?.join(", ")
            : "-"}
        </Td>
      </Tr>
      <Tr key={`child-${resource.resource}`} isExpanded={expanded}>
        <Td />
        <Td colSpan={5}>
          {expanded && (
            <ExpandableRowContent>
              <DescriptionList
                isHorizontal
                className="keycloak_resource_details"
              >
                <TextContent>
                  <TextList>
                    {outerPolicy.associatedPolicies?.map((item) => (
                      <TextListItem key="policyDetails">
                        <Link
                          to={toPolicyDetails({
                            realm,
                            id: clientId,
                            policyType: item.policy?.type!,
                            policyId: item.policy?.id!,
                          })}
                        >
                          {item.policy?.name}
                        </Link>{" "}
                        {t("votedToStatus", {
                          status: capitalize(item.status as string),
                        })}
                      </TextListItem>
                    ))}
                  </TextList>
                </TextContent>
              </DescriptionList>
            </ExpandableRowContent>
          )}
        </Td>
      </Tr>
    </Tbody>
  );
};
