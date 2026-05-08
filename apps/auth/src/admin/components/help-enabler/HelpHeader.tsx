/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/help-enabler/HelpHeader.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useHelp } from "../../../shared/keycloak-ui-shared";
import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Split,
  SplitItem,
  Switch,
} from "../../../shared/@patternfly/react-core";
import { Question as HelpIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import helpUrls from "../../help-urls";
import { FormattedLink } from "../external-link/FormattedLink";
export const HelpHeader = () => {
  const [open, setOpen] = useState(false);
  const help = useHelp();
  const { t } = useTranslation();

  const dropdownItems = [
    <DropdownItem key="link" id="link">
      <FormattedLink
        data-testId="documentation-link"
        href={helpUrls.documentationUrl}
        title={t("documentation")}
      />
    </DropdownItem>,
    <Divider key="divide" />,
    <DropdownItem key="enable" id="enable" description={t("helpToggleInfo")}>
      <Split>
        <SplitItem isFilled>{t("enableHelpMode")}</SplitItem>
        <SplitItem>
          <Switch
            id="enableHelp"
            aria-label={t("enableHelp")}
            isChecked={help.enabled}
            label=""
            className="keycloak_help-header-switch"
            onChange={() => help.toggleHelp()}
          />
        </SplitItem>
      </Split>
    </DropdownItem>,
  ];
  return (
    <Dropdown
      popperProps={{
        position: "right",
      }}
      onOpenChange={(isOpen) => setOpen(isOpen)}
      isOpen={open}
      toggle={(ref) => (
        <MenuToggle
          ref={ref}
          variant="plain"
          onClick={() => setOpen(!open)}
          aria-label="Help"
          id="help"
          data-testid="help-toggle"
        >
          <HelpIcon />
        </MenuToggle>
      )}
    >
      <DropdownList>{dropdownItems}</DropdownList>
    </Dropdown>
  );
};
