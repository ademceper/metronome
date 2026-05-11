/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-roles/UsersInRoleTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@metronome/ui/components/popover";
import { cn } from "@metronome/ui/lib/utils";
import { Question as QuestionCircleIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useHelp } from "../../shared/keycloak-ui-shared";
import { useAdminClient } from "../admin-client";
import type { ClientRoleParams } from "../clients/routes/ClientRole";
import { ListEmptyState } from "../../shared/keycloak-ui-shared";
import { KeycloakDataTable } from "../../shared/keycloak-ui-shared";
import { useRealm } from "../context/realm-context/RealmContext";
import { emptyFormatter, upperCaseFormatter } from "../util";
import { useParams } from "../utils/useParams";


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
const Popover = ({ bodyContent, headerContent, footerContent, children, position, ...props }: any) => (
  <UIPopover {...props}>
    <UIPopoverTrigger asChild>{children}</UIPopoverTrigger>
    <UIPopoverContent>
      {headerContent ? (
        <div className="font-medium text-sm">{typeof headerContent === "function" ? headerContent() : headerContent}</div>
      ) : null}
      {bodyContent ? (
        <div className="text-sm">{typeof bodyContent === "function" ? bodyContent() : bodyContent}</div>
      ) : null}
      {footerContent ? (
        <div className="pt-2 text-sm">{typeof footerContent === "function" ? footerContent() : footerContent}</div>
      ) : null}
    </UIPopoverContent>
  </UIPopover>
);

export const UsersInRoleTab = () => {
  const { adminClient } = useAdminClient();

  const navigate = useNavigate();
  const { realm } = useRealm();

  const { t } = useTranslation();
  const { id, clientId } = useParams<ClientRoleParams>();

  const loader = async (first?: number, max?: number) => {
    const role = await adminClient.roles.findOneById({ id: id });
    if (!role) {
      throw new Error(t("notFound"));
    }

    if (role.clientRole) {
      return adminClient.clients.findUsersWithRole({
        roleName: role.name!,
        id: clientId,
        briefRepresentation: true,
        first,
        max,
      });
    }

    return adminClient.roles.findUsersWithRole({
      name: role.name!,
      briefRepresentation: true,
      first,
      max,
    });
  };

  const { enabled } = useHelp();

  return (
    <PageSection data-testid="users-page" variant="light">
      <KeycloakDataTable
        isPaginated
        loader={loader}
        ariaLabelKey="roleList"
        searchPlaceholderKey=""
        data-testid="users-in-role-table"
        toolbarItem={
          enabled && (
            <Popover
              aria-label="Basic popover"
              position="bottom"
              bodyContent={
                <div>
                  {t("whoWillAppearPopoverTextRoles")}
                  <Button
                    className="kc-groups-link"
                    variant="link"
                    onClick={() => navigate(`/${realm}/groups`)}
                  >
                    {t("groups")}
                  </Button>
                  {t("or")}
                  <Button
                    className="kc-users-link"
                    variant="link"
                    onClick={() => navigate(`/${realm}/users`)}
                  >
                    {t("users")}.
                  </Button>
                </div>
              }
              footerContent={t("whoWillAppearPopoverFooterText")}
            >
              <Button
                variant="link"
                className="kc-who-will-appear-button"
                key="who-will-appear-button"
                icon={<QuestionCircleIcon />}
              >
                {t("whoWillAppearLinkTextRoles")}
              </Button>
            </Popover>
          )
        }
        emptyState={
          <ListEmptyState
            hasIcon={true}
            message={t("noDirectUsers")}
            instructions={
              <div>
                {t("noUsersEmptyStateDescription")}
                <Button
                  className="kc-groups-link-empty-state"
                  variant="link"
                  onClick={() => navigate(`/${realm}/groups`)}
                >
                  {t("groups")}
                </Button>
                {t("or")}
                <Button
                  className="kc-users-link-empty-state"
                  variant="link"
                  onClick={() => navigate(`/${realm}/users`)}
                >
                  {t("users")}
                </Button>
                {t("noUsersEmptyStateDescriptionContinued")}
              </div>
            }
          />
        }
        columns={[
          {
            name: "username",
            displayKey: "userName",
            cellFormatters: [emptyFormatter()],
          },
          {
            name: "email",
            displayKey: "email",
            cellFormatters: [emptyFormatter()],
          },
          {
            name: "lastName",
            displayKey: "lastName",
            cellFormatters: [emptyFormatter()],
          },
          {
            name: "firstName",
            displayKey: "firstName",
            cellFormatters: [upperCaseFormatter(), emptyFormatter()],
          },
        ]}
      />
    </PageSection>
  );
};
