/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/AuthorizationEvaluateResource.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useState } from "react";
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table/table";
const ExpandableRowContent = ({ children }: any) => <>{children}</>;
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { AuthorizationEvaluateResourcePolicies } from "./AuthorizationEvaluateResourcePolicies";
import type EvaluationResultRepresentation from "@keycloak/keycloak-admin-client/lib/defs/evaluationResultRepresentation";
import type PolicyResultRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyResultRepresentation";


const DescriptionList = ({ isHorizontal, columnModifier, children, ...props }: any) => (
  <dl className={cn("grid gap-y-2 text-sm",
    isHorizontal && "grid-cols-[max-content_1fr] gap-x-4",
    (props as any).className)} {...props}>
    {children}
  </dl>
);

type Props = {
  rowIndex: number;
  resource: EvaluationResultRepresentation;
  evaluateResults: any;
};

export const AuthorizationEvaluateResource = ({
  rowIndex,
  resource,
  evaluateResults,
}: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <Tbody isExpanded={expanded}>
      <Tr>
        <Td
          expand={{
            rowIndex,
            isExpanded: expanded,
            onToggle: () => setExpanded((prev) => !prev),
          }}
        />
        <Td data-testid={`name-column-${resource.resource}`}>
          {resource.resource?.name}
        </Td>
        <Td id={resource.status?.toLowerCase()}>
          {t(`${resource.status?.toLowerCase()}`)}
        </Td>
        <Td>
          {resource.allowedScopes?.length
            ? resource.allowedScopes.map((item) => item.name)
            : "-"}
        </Td>
      </Tr>
      <Tr key={`child-${resource.resource}`} isExpanded={expanded}>
        <Td />
        <Td colSpan={5}>
          <ExpandableRowContent>
            {expanded && (
              <DescriptionList
                isHorizontal
                className="keycloak_resource_details"
              >
                <Table aria-label={t("evaluationResults")}>
                  <Thead>
                    <Tr>
                      <Th aria-hidden="true" />
                      <Th>{t("permission")}</Th>
                      <Th>{t("results")}</Th>
                      <Th>{t("decisionStrategy")}</Th>
                      <Th>{t("grantedScopes")}</Th>
                      <Th>{t("deniedScopes")}</Th>
                      <Th aria-hidden="true" />
                    </Tr>
                  </Thead>
                  {Object.values(evaluateResults[rowIndex].policies).map(
                    (outerPolicy, idx) => (
                      <AuthorizationEvaluateResourcePolicies
                        key={idx}
                        idx={idx}
                        rowIndex={rowIndex}
                        outerPolicy={outerPolicy as PolicyResultRepresentation}
                        resource={resource}
                      />
                    ),
                  )}
                </Table>
              </DescriptionList>
            )}
          </ExpandableRowContent>
        </Td>
      </Tr>
    </Tbody>
  );
};
