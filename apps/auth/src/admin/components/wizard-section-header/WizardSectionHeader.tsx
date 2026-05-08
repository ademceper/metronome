/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/wizard-section-header/WizardSectionHeader.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  Text,
  TextContent,
  Title,
} from "../../../shared/@patternfly/react-core";
export type WizardSectionHeaderProps = {
  title: string;
  description?: string;
  showDescription?: boolean;
};

export const WizardSectionHeader = ({
  title,
  description,
  showDescription = false,
}: WizardSectionHeaderProps) => {
  return (
    <>
      <Title
        size={"xl"}
        headingLevel={"h2"}
        className={
          showDescription
            ? "kc-wizard-section-header__title--has-description"
            : "kc-wizard-section-header__title"
        }
      >
        {title}
      </Title>
      {showDescription && (
        <TextContent className="kc-wizard-section-header__description">
          <Text>{description}</Text>
        </TextContent>
      )}
    </>
  );
};
