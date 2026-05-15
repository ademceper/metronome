/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/NewOrganization.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { FormSubmitButton } from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { FormAccess } from "../form/FormAccess";
import { ViewHeader } from "../view-header/ViewHeader";
import { useRealm } from "../../context/realm-context/RealmContext";
import {
  OrganizationForm,
  OrganizationFormType,
  convertToOrg,
} from "./OrganizationForm";
import { toEditOrganization } from "../../lib/organizations";
import { toOrganizations } from "../../lib/organizations";


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

export default function NewOrganization() {
  const { adminClient } = useAdminClient();
  const { addAlert, addError } = useAlerts();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { realm } = useRealm();
  const form = useForm({ mode: "onChange" });
  const { handleSubmit, formState } = form;

  const save = async (org: OrganizationFormType) => {
    try {
      const organization = convertToOrg(org);
      const { id } = await adminClient.organizations.create(organization);
      addAlert(t("organizationSaveSuccess"));
      navigate(toEditOrganization({ realm, id, tab: "settings" }));
    } catch (error) {
      addError("organizationSaveError", error);
    }
  };

  return (
    <>
      <ViewHeader titleKey="createOrganization" />
      <PageSection variant="light">
        <FormAccess role="anyone" onSubmit={handleSubmit(save)} isHorizontal>
          <FormProvider {...form}>
            <OrganizationForm />
            <ActionGroup>
              <FormSubmitButton formState={formState} data-testid="save">
                {t("save")}
              </FormSubmitButton>
              <Button
                data-testid="cancel"
                variant="link"
                component={(props) => (
                  <Link {...props} to={toOrganizations({ realm })} />
                )}
              >
                {t("cancel")}
              </Button>
            </ActionGroup>
          </FormProvider>
        </FormAccess>
      </PageSection>
    </>
  );
}
