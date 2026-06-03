/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/IdentityProvidersSection.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import type { IdentityProvidersQuery } from "@keycloak/keycloak-admin-client/lib/resources/identityProviders";
import { IconMapper, useAlerts, useFetch } from "../../../shared/keycloak-ui-shared";
import { Action, DataTable } from "@metronome/ui/components/data-table";
import { ListEmptyState } from "@metronome/ui/components/list-empty-state";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { CardTitle as UICardTitle } from "@metronome/ui/components/card";
import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuGroup as UIDropdownMenuGroup, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { groupBy, sortBy } from "lodash-es";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useConfirmDialog } from "../confirm-dialog/ConfirmDialog";
import { ClickableCard } from "../keycloak-card/ClickableCard";
import { ViewHeader } from "../view-header/ViewHeader";
import { useRealm } from "../../context/realm-context/realm-context";
import { useServerInfo } from "../../context/server-info/server-info-provider";
import helpUrls from "../../help-urls";
import { toEditOrganization } from "../../lib/organizations";
import { upperCaseFormatter } from "../../util";
import { ManageOrderDialog } from "./ManageOrderDialog";
import { toIdentityProvider } from "../../lib/identity-providers";
import { toIdentityProviderCreate } from "../../lib/identity-providers";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Badge = ({ isRead, ...props }: any) => <UIBadge {...props} />;
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
const CardTitle = (props: any) => <UICardTitle {...props} />;
const Checkbox = ({ id, label, description, isChecked, isDisabled, onChange, name, ...props }: any) => (
  <div className="flex items-start gap-2">
    <UICheckbox id={id} name={name} checked={isChecked} disabled={isDisabled}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);
const Dropdown = ({ toggle, isOpen, onSelect, onOpenChange, popperProps, children, ...props }: any) => {
  const trigger = typeof toggle === "function" ? toggle((node: HTMLElement | null) => node) : toggle;
  return (
    <UIDropdownMenu open={isOpen} onOpenChange={(open: boolean) => onOpenChange?.(open)}>
      <UIDropdownMenuTrigger asChild>{trigger}</UIDropdownMenuTrigger>
      <UIDropdownMenuContent>{children}</UIDropdownMenuContent>
    </UIDropdownMenu>
  );
};
const DropdownGroup = ({ label, children, ...props }: any) => (
  <UIDropdownMenuGroup {...props}>
    {label ? <div className="px-2 py-1 font-medium text-muted-foreground text-xs">{label}</div> : null}
    {children}
  </UIDropdownMenuGroup>
);
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const DropdownList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Gallery = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-3 sm:grid-cols-2 md:grid-cols-3", className)} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

const DetailLink = (identityProvider: IdentityProviderRepresentation) => {
  const { t } = useTranslation();
  const { realm } = useRealm();

  return (
    <Link
      key={identityProvider.providerId}
      to={toIdentityProvider({
        realm,
        providerId: identityProvider.providerId!,
        alias: identityProvider.alias!,
        tab: "settings",
      })}
    >
      {identityProvider.displayName || identityProvider.alias}
      {!identityProvider.enabled && (
        <Badge
          key={`${identityProvider.providerId}-disabled`}
          isRead
          className="pf-v5-u-ml-sm"
        >
          {t("disabled")}
        </Badge>
      )}
    </Link>
  );
};

const OrganizationLink = (identityProvider: IdentityProviderRepresentation) => {
  const { t } = useTranslation();
  const { realm } = useRealm();

  if (!identityProvider?.organizationId) {
    return "—";
  }

  return (
    <Link
      key={identityProvider.providerId}
      to={toEditOrganization({
        realm,
        id: identityProvider.organizationId,
        tab: "identityProviders",
      })}
    >
      {t("organization")}
    </Link>
  );
};

export default function IdentityProvidersSection() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const identityProviders = groupBy(
    useServerInfo().identityProviders,
    "groupName",
  );
  const { realm } = useRealm();
  const navigate = useNavigate();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [hide, setHide] = useState(false);
  const [addProviderOpen, setAddProviderOpen] = useState(false);
  const [manageDisplayDialog, setManageDisplayDialog] = useState(false);
  const [hasProviders, setHasProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<IdentityProviderRepresentation>();
  const { addAlert, addError } = useAlerts();

  useFetch(
    async () => adminClient.identityProviders.find({ max: 1 }),
    (providers) => {
      setHasProviders(providers.length === 1);
    },
    [key],
  );

  const loader = async (first?: number, max?: number, search?: string) => {
    const params: IdentityProvidersQuery = {
      first: first!,
      max: max!,
      realmOnly: hide,
    };
    if (search) {
      params.search = search;
    }
    const providers = await adminClient.identityProviders.find(params);
    return providers;
  };

  const navigateToCreate = (providerId: string) =>
    navigate(
      toIdentityProviderCreate({
        realm,
        providerId,
      }),
    );

  const identityProviderOptions = () =>
    Object.keys(identityProviders).map((group) => (
      <DropdownGroup key={group} label={group}>
        {sortBy(identityProviders[group], "name").map((provider) => (
          <DropdownItem
            key={provider.id}
            value={provider.id}
            component="a"
            data-testid={provider.id}
            onClick={() =>
              navigate(
                toIdentityProviderCreate({
                  realm,
                  providerId: provider.id,
                }),
              )
            }
          >
            {provider.name}
          </DropdownItem>
        ))}
      </DropdownGroup>
    ));

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deleteProvider",
    messageKey: t("deleteConfirm", { provider: selectedProvider?.alias }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.identityProviders.del({
          alias: selectedProvider!.alias!,
        });
        refresh();
        addAlert(t("deletedSuccessIdentityProvider"), AlertVariant.success);
      } catch (error) {
        addError("deleteErrorIdentityProvider", error);
      }
    },
  });

  return (
    <>
      <DeleteConfirm />
      {manageDisplayDialog && (
        <ManageOrderDialog
          hideRealmBasedIdps={hide}
          onClose={() => {
            setManageDisplayDialog(false);
            refresh();
          }}
        />
      )}
      <ViewHeader
        titleKey="identityProviders"
        subKey="listExplain"
        helpUrl={helpUrls.identityProvidersUrl}
      />
      <PageSection
        variant={!hasProviders ? "default" : "light"}
        className={!hasProviders ? "" : "pf-v5-u-p-0"}
      >
        {!hasProviders && (
          <>
            <TextContent>
              <Text component={TextVariants.p}>{t("getStarted")}</Text>
            </TextContent>
            {Object.keys(identityProviders).map((group) => (
              <Fragment key={group}>
                <TextContent>
                  <Text className="pf-v5-u-mt-lg" component={TextVariants.h2}>
                    {group}:
                  </Text>
                </TextContent>
                <hr className="pf-v5-u-mb-lg" />
                <Gallery hasGutter>
                  {sortBy(identityProviders[group], "name").map((provider) => (
                    <ClickableCard
                      key={provider.id}
                      data-testid={`${provider.id}-card`}
                      onClick={() => navigateToCreate(provider.id)}
                    >
                      <CardTitle>
                        <Split hasGutter>
                          <SplitItem>
                            <IconMapper icon={provider.id} />
                          </SplitItem>
                          <SplitItem isFilled>{provider.name}</SplitItem>
                        </Split>
                      </CardTitle>
                    </ClickableCard>
                  ))}
                </Gallery>
              </Fragment>
            ))}
          </>
        )}
        {hasProviders && (
          <DataTable
            t={t}
            key={key}
            loader={loader}
            isPaginated
            ariaLabelKey="identityProviders"
            searchPlaceholderKey="searchForProvider"
            toolbarItem={
              <>
                <ToolbarItem alignSelf="center">
                  <Checkbox
                    label={t("hideOrganizationLinkedIdps")}
                    id="hideOrganizationLinkedIdps"
                    data-testid="hideOrganizationLinkedIdps"
                    isChecked={hide}
                    onChange={(_event, check) => {
                      setHide(check);
                      refresh();
                    }}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Dropdown
                    data-testid="addProviderDropdown"
                    onOpenChange={(isOpen) => setAddProviderOpen(isOpen)}
                    toggle={(ref) => (
                      <MenuToggle
                        ref={ref}
                        onClick={() => setAddProviderOpen(!addProviderOpen)}
                        variant="primary"
                      >
                        {t("addProvider")}
                      </MenuToggle>
                    )}
                    isOpen={addProviderOpen}
                  >
                    <DropdownList>{identityProviderOptions()}</DropdownList>
                  </Dropdown>
                </ToolbarItem>

                <ToolbarItem>
                  <Button
                    data-testid="manageDisplayOrder"
                    variant="link"
                    onClick={() => setManageDisplayDialog(true)}
                  >
                    {t("manageDisplayOrder")}
                  </Button>
                </ToolbarItem>
              </>
            }
            actions={[
              {
                title: t("delete"),
                onRowClick: (provider) => {
                  setSelectedProvider(provider);
                  toggleDeleteDialog();
                },
              } as Action<IdentityProviderRepresentation>,
            ]}
            columns={[
              {
                name: "alias",
                displayKey: "name",
                cellRenderer: DetailLink,
              },
              {
                name: "providerId",
                displayKey: "providerDetails",
                cellFormatters: [upperCaseFormatter()],
              },
              {
                name: "organizationId",
                displayKey: "linkedOrganization",
                cellRenderer: OrganizationLink,
              },
            ]}
            emptyState={
              <ListEmptyState
                message={t("identityProviders")}
                instructions={t("emptyRealmBasedIdps")}
                isSearchVariant
                secondaryActions={[
                  {
                    text: t("clearAllFilters"),
                    onClick: () => {
                      setHide(false);
                      refresh();
                    },
                    type: ButtonVariant.link,
                  },
                ]}
              />
            }
          />
        )}
      </PageSection>
    </>
  );
}
