/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/TextComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@metronome/ui/components/form";
import { Input } from "@metronome/ui/components/input";
import type { ReactNode } from "react";
import { UserProfileFieldProps } from "./UserProfileFields";
import {
  fieldName,
  isRequiredAttribute,
  label,
  labelAttribute,
} from "./utils";

const TextInputTypes = {
  text: "text",
  password: "password",
  email: "email",
  number: "number",
  search: "search",
  url: "url",
  tel: "tel",
  date: "date",
  time: "time",
} as const;

export const TextComponent = (props: UserProfileFieldProps) => {
  const { form, inputType, attribute, t, renderer } = props;
  const isRequired = isRequiredAttribute(attribute);
  const type = inputType.startsWith("html")
    ? (inputType.substring("html".length + 2) as keyof typeof TextInputTypes)
    : "text";
  const labelText = labelAttribute(t, attribute) || attribute.name || "";
  const placeholder = attribute.readOnly
    ? ""
    : label(
        t,
        attribute.annotations?.["inputTypePlaceholder"] as string,
        "",
        attribute.annotations?.["inputOptionLabelsI18nPrefix"] as string,
      );
  const helpText = label(
    t,
    attribute.annotations?.["inputHelperTextBefore"] as string,
  );
  const extra = renderer?.(attribute);

  const floatingLabel: ReactNode = (
    <>
      {labelText}
      {isRequired && <span className="ml-0.5 text-destructive">*</span>}
    </>
  );

  return (
    <FormField
      control={form.control}
      name={fieldName(attribute.name)}
      defaultValue={attribute.defaultValue ?? ""}
      render={({ field }) => (
        <FormItem>
          {extra ? (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <FormControl>
                  <Input
                    variant="floating"
                    label={floatingLabel}
                    id={attribute.name}
                    data-testid={attribute.name}
                    type={type}
                    placeholder={placeholder}
                    disabled={attribute.readOnly}
                    required={isRequired}
                    {...field}
                  />
                </FormControl>
              </div>
              {extra}
            </div>
          ) : (
            <FormControl>
              <Input
                variant="floating"
                label={floatingLabel}
                id={attribute.name}
                data-testid={attribute.name}
                type={type}
                placeholder={placeholder}
                disabled={attribute.readOnly}
                required={isRequired}
                {...field}
              />
            </FormControl>
          )}
          {helpText && (
            <p className="text-muted-foreground text-xs">{helpText}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
