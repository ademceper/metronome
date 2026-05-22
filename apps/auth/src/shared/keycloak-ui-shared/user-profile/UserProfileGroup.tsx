/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/UserProfileGroup.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { UserProfileAttributeMetadata } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import { Label } from "@metronome/ui/components/label";
import { TFunction } from "i18next";
import { get } from "lodash-es";
import { PropsWithChildren, ReactNode } from "react";
import { UseFormReturn, type FieldError } from "react-hook-form";

import { HelpItem } from "../controls/HelpItem";
import {
  UserFormFields,
  fieldName,
  isRequiredAttribute,
  label,
  labelAttribute,
} from "./utils";

const floatingInputTypes = new Set([
  undefined,
  "text",
  "email",
  "password",
  "tel",
  "url",
  "number",
  "search",
  "html5-text",
  "html5-email",
  "html5-password",
  "html5-tel",
  "html5-url",
  "html5-number",
  "html5-search",
  "html5-date",
  "html5-time",
  "html5-datetime-local",
  "html5-month",
  "html5-week",
]);

const isFloatingCapable = (attribute: UserProfileAttributeMetadata) =>
  floatingInputTypes.has(attribute.annotations?.["inputType"] as string);

export type UserProfileGroupProps = {
  t: TFunction;
  form: UseFormReturn<UserFormFields>;
  attribute: UserProfileAttributeMetadata;
  renderer?: (attribute: UserProfileAttributeMetadata) => ReactNode;
};

export const UserProfileGroup = ({
  t,
  form,
  attribute,
  renderer,
  children,
}: PropsWithChildren<UserProfileGroupProps>) => {
  const helpText = label(
    t,
    attribute.annotations?.["inputHelperTextBefore"] as string,
  );
  const {
    formState: { errors },
  } = form;

  const component = renderer?.(attribute);
  const error = get(errors, fieldName(attribute.name)) as FieldError;
  const errorMessage = error?.message as string | undefined;
  const required = isRequiredAttribute(attribute);
  const hideOuterLabel = isFloatingCapable(attribute);

  const labelNode = !hideOuterLabel ? (
    <Label htmlFor={attribute.name!}>
      <span className="inline-flex items-center gap-1">
        {labelAttribute(t, attribute) || ""}
        {helpText ? (
          <HelpItem helpText={helpText} fieldLabelId={attribute.name!} />
        ) : null}
      </span>
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </Label>
  ) : null;

  return (
    <div key={attribute.name} className="space-y-1.5">
      {labelNode}
      {component ? (
        <div className="flex items-center gap-2">
          <div className="flex-1">{children}</div>
          {component}
        </div>
      ) : (
        children
      )}
      <div
        data-visible={!!errorMessage}
        aria-hidden={!errorMessage}
        className="-mt-1.5 grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,margin-top] duration-200 ease-out data-[visible=true]:mt-0 data-[visible=true]:grid-rows-[1fr] data-[visible=true]:opacity-100"
      >
        <div className="overflow-hidden">
          <p
            id={`${attribute.name}-error`}
            className="text-destructive text-sm"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
