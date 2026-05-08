/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/components/GroupToolbar.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  ToolbarItem,
} from "../../../shared/@patternfly/react-core";
import { DotsThreeVertical as EllipsisVIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next";
import { useAccess } from "../../context/access/Access";
import useToggle from "../../utils/useToggle";
import { useSubGroups } from "../SubGroupsContext";

type GroupToolbarProps = {
  toggleCreate: () => void;
  toggleDelete: () => void;
  kebabDisabled: boolean;
};

export const GroupToolbar = ({
  toggleCreate,
  toggleDelete,
  kebabDisabled,
}: GroupToolbarProps) => {
  const { t } = useTranslation();
  const { currentGroup } = useSubGroups();
  const { hasAccess } = useAccess();
  const isManager = hasAccess("manage-users") || currentGroup()?.access?.manage;

  const [openKebab, toggleKebab] = useToggle();

  if (!isManager) return <div />;

  return (
    <>
      <ToolbarItem>
        <Button
          data-testid="openCreateGroupModal"
          variant="primary"
          onClick={toggleCreate}
        >
          {t("createGroup")}
        </Button>
      </ToolbarItem>
      <ToolbarItem>
        <Dropdown
          onOpenChange={toggleKebab}
          toggle={(ref) => (
            <MenuToggle
              data-testid="kebab"
              ref={ref}
              isExpanded={openKebab}
              onClick={toggleKebab}
              isDisabled={kebabDisabled}
              variant="plain"
              aria-label="Actions"
            >
              <EllipsisVIcon />
            </MenuToggle>
          )}
          isOpen={openKebab}
        >
          <DropdownList>
            <DropdownItem
              key="action"
              component="button"
              onClick={() => {
                toggleDelete();
                toggleKebab();
              }}
            >
              {t("delete")}
            </DropdownItem>
          </DropdownList>
        </Dropdown>
      </ToolbarItem>
    </>
  );
};
