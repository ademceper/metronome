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
import { cn } from "@metronome/ui/lib/utils";
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


const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);

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

  const labelNode = (
    <span className="inline-flex items-center gap-1">
      {labelAttribute(t, attribute) || ""}
      {helpText ? (
        <HelpItem helpText={helpText} fieldLabelId={attribute.name!} />
      ) : null}
    </span>
  );

  const required = isRequiredAttribute(attribute);
  const errorMessage = error?.message as string | undefined;

  return (
    <div key={attribute.name} className="space-y-2">
      <Label htmlFor={attribute.name!}>
        {labelNode}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {component ? (
        <InputGroup>
          {children}
          {component}
        </InputGroup>
      ) : (
        children
      )}
      {errorMessage ? (
        <p
          id={`${attribute.name}-error`}
          className="text-destructive text-sm"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
