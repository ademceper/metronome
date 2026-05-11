/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/role-form/RoleForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import {
  SubmitHandler,
  UseFormReturn,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, To } from "react-router-dom";
import {
  FormSubmitButton,
  TextAreaControl,
  TextControl,
} from "../../../shared/keycloak-ui-shared";

import { FormAccess } from "../form/FormAccess";
import { AttributeForm } from "../key-value-form/AttributeForm";
import { ViewHeader } from "../view-header/ViewHeader";


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export type RoleFormProps = {
  form: UseFormReturn<AttributeForm>;
  onSubmit: SubmitHandler<AttributeForm>;
  cancelLink: To;
  role: "manage-realm" | "manage-clients";
  editMode: boolean;
};

export const RoleForm = ({
  form: { formState },
  onSubmit,
  cancelLink,
  role,
  editMode,
}: RoleFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useFormContext<AttributeForm>();

  const roleName = useWatch({
    control,
    defaultValue: undefined,
    name: "name",
  });

  return (
    <>
      {!editMode && <ViewHeader titleKey={t("createRole")} />}
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          onSubmit={handleSubmit(onSubmit)}
          role={role}
          className="pf-v5-u-mt-lg"
          fineGrainedAccess={true} // We would never want to show this form in read-only mode
        >
          <TextControl
            name="name"
            label={t("roleName")}
            rules={{
              required: !editMode ? t("required") : undefined,
              validate(value) {
                if (!value?.trim()) {
                  return t("required");
                }
              },
            }}
            isDisabled={editMode}
          />
          <TextAreaControl
            name="description"
            label={t("description")}
            rules={{
              maxLength: {
                value: 255,
                message: t("maxLength", { length: 255 }),
              },
            }}
            isDisabled={roleName?.includes("default-roles") ?? false}
          />
          <ActionGroup>
            <FormSubmitButton
              formState={formState}
              data-testid="save"
              allowInvalid
              allowNonDirty
            >
              {t("save")}
            </FormSubmitButton>
            <Button
              data-testid="cancel"
              variant="link"
              component={(props) => <Link {...props} to={cancelLink} />}
            >
              {t("cancel")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </>
  );
};
