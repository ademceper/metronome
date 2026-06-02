/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/policies/PasswordPolicy.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type PasswordPolicyTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/passwordPolicyTypeRepresentation";
import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { cn } from "@metronome/ui/lib/utils";
import { PlusCircle as PlusCircleIcon } from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../form/FormAccess";
import { useRealm } from "../../../context/realm-context/realm-context";
import { useServerInfo } from "../../../context/server-info/server-info-provider";
import { PolicyRow } from "./PolicyRow";
import { SubmittedValues, parsePolicy, serializePolicy } from "./util";
import { Select, SelectOption } from "../../../../shared/pf-compat"


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
const Divider = (props: any) => <UISeparator {...props} />;
const EmptyState = ({ variant, titleText, headingLevel, icon, children, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-3 py-10 text-center", (props as any).className)} {...props}>
    {icon ? <div className="text-muted-foreground">{React.createElement(icon)}</div> : null}
    {titleText ? <h3 className="font-medium text-lg">{titleText}</h3> : null}
    {children}
  </div>
);
const EmptyStateActions = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const EmptyStateBody = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props}>{children}</div>
);
const EmptyStateFooter = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-2", className)} {...props}>{children}</div>
);
const EmptyStateHeader = ({ titleText, headingLevel = "h4", icon, children, ...props }: any) => (
  <div className="flex flex-col items-center gap-2" {...props}>
    {icon}
    {titleText ? React.createElement(headingLevel, { className: "font-medium text-base" }, titleText) : null}
    {children}
  </div>
);
const EmptyStateIcon = ({ icon, ...props }: any) => icon ? React.createElement(icon, { ...props }) : null;
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Toolbar = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const ToolbarContent = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>{children}</div>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const SelectList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

type PolicySelectProps = {
  onSelect: (row: PasswordPolicyTypeRepresentation) => void;
  selectedPolicies: PasswordPolicyTypeRepresentation[];
};

const PolicySelect = ({ onSelect, selectedPolicies }: PolicySelectProps) => {
  const { t } = useTranslation();
  const { passwordPolicies } = useServerInfo();
  const [open, setOpen] = useState(false);

  const policies = useMemo(
    () =>
      passwordPolicies?.filter(
        (p) => selectedPolicies.find((o) => o.id === p.id) === undefined,
      ),
    [selectedPolicies],
  );

  return (
    <Select
      onSelect={(_, selection) => {
        onSelect(selection as PasswordPolicyTypeRepresentation);
        setOpen(false);
      }}
      toggle={(ref) => (
        <MenuToggle
          ref={ref}
          onClick={() => setOpen(!open)}
          isExpanded={open}
          isDisabled={policies?.length === 0}
          style={{ width: "300px" }}
          data-testid="add-policy"
        >
          {t("addPolicy")}
        </MenuToggle>
      )}
      isOpen={open}
    >
      <SelectList>
        {policies?.map((policy) => (
          <SelectOption key={policy.id} value={policy}>
            {policy.displayName}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};

type PasswordPolicyProps = {
  realm: RealmRepresentation;
  realmUpdated: (realm: RealmRepresentation) => void;
};

export const PasswordPolicy = ({
  realm,
  realmUpdated,
}: PasswordPolicyProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { passwordPolicies } = useServerInfo();

  const { addAlert, addError } = useAlerts();
  const { realm: realmName, refresh } = useRealm();

  const [rows, setRows] = useState<PasswordPolicyTypeRepresentation[]>([]);
  const onSelect = (row: PasswordPolicyTypeRepresentation) => {
    setRows([...rows, row]);
    setValue(row.id!, row.defaultValue!, { shouldDirty: true });
  };

  const form = useForm<SubmittedValues>({
    defaultValues: {},
  });
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty },
  } = form;

  const setupForm = (realm: RealmRepresentation) => {
    reset();
    const values = parsePolicy(realm.passwordPolicy || "", passwordPolicies!);
    values.forEach((v) => {
      setValue(v.id!, v.value!);
    });
    setRows(values);
  };

  useEffect(() => setupForm(realm), []);

  const save = async (values: SubmittedValues) => {
    const updatedRealm = {
      ...realm,
      passwordPolicy: serializePolicy(rows, values),
    };
    try {
      await adminClient.realms.update({ realm: realmName }, updatedRealm);
      realmUpdated(updatedRealm);
      setupForm(updatedRealm);
      refresh();
      addAlert(t("updatePasswordPolicySuccess"), AlertVariant.success);
    } catch (error: any) {
      addError("updatePasswordPolicyError", error);
    }
  };

  return (
    <PageSection variant="light" className="pf-v5-u-p-0">
      {(rows.length !== 0 || realm.passwordPolicy) && (
        <>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <PolicySelect onSelect={onSelect} selectedPolicies={rows} />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          <Divider />
          <PageSection variant="light">
            <FormProvider {...form}>
              <FormAccess
                className="keycloak__policies_authentication__form"
                role="manage-realm"
                isHorizontal
                onSubmit={handleSubmit(save)}
              >
                {rows.map((r, index) => (
                  <PolicyRow
                    key={`${r.id}-${index}`}
                    policy={r}
                    onRemove={(id) => {
                      setRows(rows.filter((r) => r.id !== id));
                      setValue(r.id!, "", { shouldDirty: true });
                    }}
                  />
                ))}
                <ActionGroup>
                  <Button
                    data-testid="save"
                    variant="primary"
                    type="submit"
                    isDisabled={!isDirty}
                  >
                    {t("save")}
                  </Button>
                  <Button
                    data-testid="reload"
                    variant={ButtonVariant.link}
                    onClick={() => setupForm(realm)}
                  >
                    {t("reload")}
                  </Button>
                </ActionGroup>
              </FormAccess>
            </FormProvider>
          </PageSection>
        </>
      )}
      {!rows.length && !realm.passwordPolicy && (
        <EmptyState data-testid="empty-state" variant="lg">
          <EmptyStateHeader
            titleText={<>{t("noPasswordPolicies")}</>}
            icon={<EmptyStateIcon icon={PlusCircleIcon} />}
            headingLevel="h1"
          />
          <EmptyStateBody>{t("noPasswordPoliciesInstructions")}</EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <PolicySelect onSelect={onSelect} selectedPolicies={[]} />
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      )}
    </PageSection>
  );
};
