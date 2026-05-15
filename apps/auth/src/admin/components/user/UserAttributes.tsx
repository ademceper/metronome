/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/UserAttributes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { cn } from "@metronome/ui/lib/utils";
import { UseFormReturn, useFormContext } from "react-hook-form";

import {
  AttributeForm,
  AttributesForm,
} from "../key-value-form/AttributeForm";
import { UserFormFields, toUserFormFields } from "./form-state";
import {
  UnmanagedAttributePolicy,
  UserProfileConfig,
} from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";


const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const PageSectionVariants = {
  default: "default",
  light: "light",
  dark: "dark",
  darker: "darker",
} as const;

type UserAttributesProps = {
  user: UserRepresentation;
  save: (user: UserFormFields) => void;
  upConfig?: UserProfileConfig;
};

export const UserAttributes = ({
  user,
  save,
  upConfig,
}: UserAttributesProps) => {
  const form = useFormContext<UserFormFields>();

  return (
    <PageSection variant={PageSectionVariants.light}>
      <AttributesForm
        form={form as UseFormReturn<AttributeForm>}
        save={save}
        fineGrainedAccess={user.access?.manage}
        reset={() =>
          form.reset({
            ...form.getValues(),
            attributes: toUserFormFields(user).attributes,
          })
        }
        name="unmanagedAttributes"
        isDisabled={
          UnmanagedAttributePolicy.AdminView ==
          upConfig?.unmanagedAttributePolicy
        }
      />
    </PageSection>
  );
};
