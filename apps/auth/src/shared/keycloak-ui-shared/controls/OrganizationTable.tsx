/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/OrganizationTable.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
const TableText = ({ children }: any) => (
  <span className="block truncate">{children}</span>
);
import { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Action, LoaderFunction } from "./table/KeycloakDataTable";
import { KeycloakDataTable } from "./table/KeycloakDataTable";


const Badge = ({ isRead, ...props }: any) => <UIBadge {...props} />;
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
);

type OrgDetailLinkProps = {
  link: FunctionComponent<
    PropsWithChildren<{ organization: OrganizationRepresentation }>
  >;
  organization: OrganizationRepresentation;
};

const OrgDetailLink = ({ link, organization }: OrgDetailLinkProps) => {
  const { t } = useTranslation();
  const Component = link;
  return (
    <TableText wrapModifier="truncate">
      <Component organization={organization}>
        {organization.name}
        {!organization.enabled && (
          <Badge
            key={`${organization.id}-disabled`}
            isRead
            className="pf-v5-u-ml-sm"
          >
            {t("disabled")}
          </Badge>
        )}
      </Component>
    </TableText>
  );
};

const Domains = (org: OrganizationRepresentation) => {
  const { t } = useTranslation();
  return (
    <ChipGroup
      numChips={2}
      expandedText={t("hide")}
      collapsedText={t("showRemaining")}
    >
      {org.domains?.map((dn) => {
        const name = typeof dn === "string" ? dn : dn.name;
        return (
          <Chip key={name} isReadOnly>
            {name}
          </Chip>
        );
      })}
    </ChipGroup>
  );
};

export type OrganizationTableProps = PropsWithChildren & {
  loader:
    | LoaderFunction<OrganizationRepresentation>
    | OrganizationRepresentation[];
  link: FunctionComponent<
    PropsWithChildren<{ organization: OrganizationRepresentation }>
  >;
  toolbarItem?: ReactNode;
  isPaginated?: boolean;
  isSearching?: boolean;
  searchPlaceholderKey?: string;
  onSelect?: (orgs: OrganizationRepresentation[]) => void;
  onDelete?: (org: OrganizationRepresentation) => void;
  deleteLabel?: string;
  actions?: Action<OrganizationRepresentation>[];
};

export const OrganizationTable = ({
  loader,
  toolbarItem,
  isPaginated = false,
  isSearching = false,
  searchPlaceholderKey,
  onSelect,
  onDelete,
  deleteLabel = "delete",
  link,
  children,
  actions,
}: OrganizationTableProps) => {
  const { t } = useTranslation();

  return (
    <KeycloakDataTable
      loader={loader}
      isPaginated={isPaginated}
      isSearching={isSearching}
      ariaLabelKey="organizationList"
      searchPlaceholderKey={searchPlaceholderKey}
      toolbarItem={toolbarItem}
      onSelect={onSelect}
      canSelectAll={onSelect !== undefined}
      actions={[
        ...(onDelete ? [{ title: t(deleteLabel), onRowClick: onDelete }] : []),
        ...(actions ?? []),
      ]}
      columns={[
        {
          name: "name",
          displayKey: "name",
          cellRenderer: (row) => (
            <OrgDetailLink link={link} organization={row} />
          ),
        },
        {
          name: "domains",
          displayKey: "domains",
          cellRenderer: Domains,
        },
        {
          name: "description",
          displayKey: "description",
        },
        {
          name: "membershipType",
          displayKey: "membershipType",
        },
      ]}
      emptyState={children}
    />
  );
};
