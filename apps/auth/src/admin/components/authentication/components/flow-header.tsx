/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/components/FlowHeader.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  TableHead as Th,
  TableRow as Tr,
} from "@metronome/ui/components/table/table";
import { useTranslation } from "react-i18next";

const DataListDragButton = (props: any) => (
  <button type="button" aria-label="drag" className="cursor-grab text-muted-foreground text-sm" {...props}>⋮⋮</button>
);

export const FlowHeader = () => {
  const { t } = useTranslation();
  return (
    <Tr aria-labelledby="headerName" id="header">
      <Th>
        <DataListDragButton
          className="keycloak__authentication__header-drag-button"
          aria-label={t("disabled")}
        />
        <Th screenReaderText={t("expandRow")} />
      </Th>
      <Th>{t("steps")}</Th>
      <Th>{t("requirement")}</Th>
      <Th screenReaderText={t("config")}></Th>
      <Th screenReaderText={t("config")}></Th>
      <Th screenReaderText={t("config")}></Th>
      <Th screenReaderText={t("config")}></Th>
    </Tr>
  );
};
