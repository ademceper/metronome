/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/ScopeDetails.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation";
import {
  TextControl,
  useAlerts,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { FormAccess } from "../../components/form/FormAccess";
import { ViewHeader } from "../../components/view-header/ViewHeader";
import { useParams } from "../../utils/useParams";
import useToggle from "../../utils/useToggle";
import { toAuthorizationTab } from "../routes/AuthenticationTab";
import type { ScopeDetailsParams } from "../routes/Scope";
import { DeleteScopeDialog } from "./DeleteScopeDialog";


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
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
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

type FormFields = Omit<ScopeRepresentation, "resources">;

export default function ScopeDetails() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { id, scopeId, realm } = useParams<ScopeDetailsParams>();
  const navigate = useNavigate();
  const { addAlert, addError } = useAlerts();
  const [deleteDialog, toggleDeleteDialog] = useToggle();
  const [scope, setScope] = useState<ScopeRepresentation>();
  const form = useForm<FormFields>({
    mode: "onChange",
  });
  const { reset, handleSubmit } = form;

  useFetch(
    async () => {
      if (scopeId) {
        const scope = await adminClient.clients.getAuthorizationScope({
          id,
          scopeId,
        });
        if (!scope) {
          throw new Error(t("notFound"));
        }
        return scope;
      }
    },
    (scope) => {
      setScope(scope);
      reset({ ...scope });
    },
    [],
  );

  const onSubmit = async (scope: ScopeRepresentation) => {
    try {
      if (scopeId) {
        await adminClient.clients.updateAuthorizationScope(
          { id, scopeId },
          scope,
        );
        setScope(scope);
      } else {
        await adminClient.clients.createAuthorizationScope(
          { id },
          {
            name: scope.name!,
            displayName: scope.displayName,
            iconUri: scope.iconUri,
          },
        );
        navigate(toAuthorizationTab({ realm, clientId: id, tab: "scopes" }));
      }
      addAlert(
        t((scopeId ? "update" : "create") + "ScopeSuccess"),
        AlertVariant.success,
      );
    } catch (error) {
      addError("scopeSaveError", error);
    }
  };

  return (
    <>
      <DeleteScopeDialog
        clientId={id}
        open={deleteDialog}
        toggleDialog={toggleDeleteDialog}
        selectedScope={scope}
        refresh={() =>
          navigate(toAuthorizationTab({ realm, clientId: id, tab: "scopes" }))
        }
      />
      <ViewHeader
        titleKey={scopeId ? scope?.name! : t("createAuthorizationScope")}
        dropdownItems={
          scopeId
            ? [
                <DropdownItem
                  key="delete"
                  data-testid="delete-resource"
                  onClick={() => toggleDeleteDialog()}
                >
                  {t("delete")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
      <PageSection variant="light">
        <FormProvider {...form}>
          <FormAccess
            isHorizontal
            role="manage-authorization"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextControl
              name="name"
              label={t("name")}
              labelIcon={t("scopeNameHelp")}
              rules={{ required: t("required") }}
            />
            <TextControl
              name="displayName"
              label={t("displayName")}
              labelIcon={t("scopeDisplayNameHelp")}
            />
            <TextControl
              name="iconUri"
              label={t("iconUri")}
              labelIcon={t("iconUriHelp")}
            />
            <ActionGroup>
              <div className="pf-v5-u-mt-md">
                <Button
                  variant={ButtonVariant.primary}
                  type="submit"
                  data-testid="save"
                >
                  {t("save")}
                </Button>

                {!scope ? (
                  <Button
                    variant="link"
                    data-testid="cancel"
                    component={(props) => (
                      <Link
                        {...props}
                        to={toAuthorizationTab({
                          realm,
                          clientId: id,
                          tab: "scopes",
                        })}
                      ></Link>
                    )}
                  >
                    {t("cancel")}
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    data-testid="revert"
                    onClick={() => reset({ ...scope })}
                  >
                    {t("revert")}
                  </Button>
                )}
              </div>
            </ActionGroup>
          </FormAccess>
        </FormProvider>
      </PageSection>
    </>
  );
}
