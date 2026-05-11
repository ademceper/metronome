/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/dashboard/ProviderInfo.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { TableToolbar } from "../../shared/keycloak-ui-shared";
import { Collapsible as UICollapsible, CollapsibleContent as UICollapsibleContent, CollapsibleTrigger as UICollapsibleTrigger } from "@metronome/ui/components/collapsible";
import { cn } from "@metronome/ui/lib/utils";
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";


const ExpandableSection = ({ toggleText, toggleTextExpanded, toggleTextCollapsed, isExpanded, onToggle, isDetached, children, ...props }: any) => (
  <UICollapsible open={isExpanded} onOpenChange={(open: boolean) => onToggle?.(undefined, open)} {...props}>
    <UICollapsibleTrigger className="flex items-center gap-2 text-sm">
      {isExpanded ? (toggleTextExpanded ?? toggleText) : (toggleTextCollapsed ?? toggleText)}
    </UICollapsibleTrigger>
    <UICollapsibleContent>{children}</UICollapsibleContent>
  </UICollapsible>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export const ProviderInfo = () => {
  const { t } = useTranslation();
  const serverInfo = useServerInfo();
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState<string[]>([]);

  const providerInfo = useMemo(
    () =>
      Object.entries(serverInfo.providers || []).filter(([key]) =>
        key.toLowerCase().includes(filter.toLowerCase()),
      ),
    [filter],
  );

  const toggleOpen = (option: string) => {
    if (open.includes(option)) {
      setOpen(open.filter((item: string) => item !== option));
    } else {
      setOpen([...open, option]);
    }
  };

  return (
    <PageSection variant="light">
      <TableToolbar
        inputGroupName="search"
        inputGroupPlaceholder={t("search")}
        inputGroupOnEnter={setFilter}
      >
        <Table variant="compact">
          <Thead>
            <Tr>
              <Th width={20}>{t("spi")}</Th>
              <Th>{t("providers")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {providerInfo.map(([name, { providers }]) => (
              <Tr key={name}>
                <Td>{name}</Td>
                <Td>
                  <ul>
                    {Object.entries(providers).map(
                      ([key, { operationalInfo }]) => (
                        <li key={key}>
                          {key}
                          {operationalInfo ? (
                            <ExpandableSection
                              key={key}
                              isExpanded={open.includes(key)}
                              onToggle={() => toggleOpen(key)}
                              toggleText={
                                open.includes(key)
                                  ? t("showLess")
                                  : t("showMore")
                              }
                            >
                              <Table borders={false}>
                                <Tbody>
                                  {Object.entries(operationalInfo).map(
                                    ([key, value]) => (
                                      <Tr key={key}>
                                        <Td>{key}</Td>
                                        <Td>{value}</Td>
                                      </Tr>
                                    ),
                                  )}
                                </Tbody>
                              </Table>
                            </ExpandableSection>
                          ) : null}
                        </li>
                      ),
                    )}
                  </ul>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableToolbar>
    </PageSection>
  );
};
