/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/TextComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Input as UIInput } from "@metronome/ui/components/input";
import { UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, isRequiredAttribute, label } from "./utils";


const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
const TextInputTypes = {
  text: "text", password: "password", email: "email", number: "number",
  search: "search", url: "url", tel: "tel", date: "date", time: "time",
} as const;

export const TextComponent = (props: UserProfileFieldProps) => {
  const { form, inputType, attribute } = props;
  const isRequired = isRequiredAttribute(attribute);
  const type = inputType.startsWith("html")
    ? (inputType.substring("html".length + 2) as TextInputTypes)
    : "text";

  return (
    <UserProfileGroup {...props}>
      <TextInput
        id={attribute.name}
        data-testid={attribute.name}
        type={type}
        placeholder={
          attribute.readOnly
            ? ""
            : label(
                props.t,
                attribute.annotations?.["inputTypePlaceholder"] as string,
                "",
                attribute.annotations?.[
                  "inputOptionLabelsI18nPrefix"
                ] as string,
              )
        }
        isDisabled={attribute.readOnly}
        isRequired={isRequired}
        defaultValue={attribute.defaultValue}
        {...form.register(fieldName(attribute.name))}
      />
    </UserProfileGroup>
  );
};
