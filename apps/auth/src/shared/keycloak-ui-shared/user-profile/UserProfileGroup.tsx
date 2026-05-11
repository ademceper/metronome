/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/UserProfileGroup.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { UserProfileAttributeMetadata } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import { cn } from "@metronome/ui/lib/utils";
import { TFunction } from "i18next";
import { get } from "lodash-es";
import { PropsWithChildren, ReactNode } from "react";
import { UseFormReturn, type FieldError } from "react-hook-form";

import { FormErrorText } from "../controls/FormErrorText";
import { HelpItem } from "../controls/HelpItem";
import {
  UserFormFields,
  fieldName,
  isRequiredAttribute,
  label,
  labelAttribute,
} from "./utils";


const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
);
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

  return (
    <FormGroup
      key={attribute.name}
      label={labelAttribute(t, attribute) || ""}
      fieldId={attribute.name}
      isRequired={isRequiredAttribute(attribute)}
      labelIcon={
        helpText ? (
          <HelpItem helpText={helpText} fieldLabelId={attribute.name!} />
        ) : undefined
      }
    >
      {component ? (
        <InputGroup>
          {children}
          {component}
        </InputGroup>
      ) : (
        children
      )}
      {error && (
        <FormErrorText
          data-testid={`${attribute.name}-helper`}
          message={error.message as string}
        />
      )}
    </FormGroup>
  );
};
