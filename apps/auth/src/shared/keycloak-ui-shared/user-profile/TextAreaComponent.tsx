/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/TextAreaComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { KeycloakTextArea } from "../controls/keycloak-text-area/KeycloakTextArea";
import { UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, isRequiredAttribute } from "./utils";

export const TextAreaComponent = (props: UserProfileFieldProps) => {
  const { form, attribute } = props;
  const isRequired = isRequiredAttribute(attribute);

  return (
    <UserProfileGroup {...props}>
      <KeycloakTextArea
        id={attribute.name}
        data-testid={attribute.name}
        {...form.register(fieldName(attribute.name))}
        cols={attribute.annotations?.["inputTypeCols"] as number}
        rows={attribute.annotations?.["inputTypeRows"] as number}
        readOnly={attribute.readOnly}
        isRequired={isRequired}
        defaultValue={attribute.defaultValue}
      />
    </UserProfileGroup>
  );
};
