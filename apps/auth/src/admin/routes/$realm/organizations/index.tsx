// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { usePageHeader } from "@metronome/ui/blocks/layout/page-header"
import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import {
  ListEmptyState,
  OrganizationTable,
  useAlerts,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { useConfirmDialog } from "../../../components/confirm-dialog/ConfirmDialog";
import { ViewHeader } from "../../../components/view-header/ViewHeader";
import { useRealm } from "../../../context/realm-context/RealmContext";
import { toEditOrganization } from "../../../lib/organizations";
import { toAddOrganization } from "../../../lib/organizations";

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
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

function OrganizationsSection() {
  const { adminClient } = useAdminClient();
  const { realm } = useRealm();
  const { t } = useTranslation();
  usePageHeader({ title: t("organizations"), description: t("organizationsExplain") });
  const { addAlert, addError } = useAlerts();
  const navigate = useNavigate();

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [selectedOrg, setSelectedOrg] = useState<OrganizationRepresentation>();

  async function loader(first?: number, max?: number, search?: string) {
    return await adminClient.organizations.find({ first, max, search });
  }

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "organizationDelete",
    messageKey: "organizationDeleteConfirm",
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.organizations.delById({
          id: selectedOrg!.id!,
        });
        addAlert(t("organizationDeletedSuccess"));
        refresh();
      } catch (error) {
        addError("organizationDeleteError", error);
      }
    },
  });

  return (
    <>
      <ViewHeader
        titleKey="organizationsList"
        subKey="organizationsExplain"
        divider
      />
      <PageSection variant="light" className="pf-v5-u-p-0">
        <DeleteConfirm />
        <OrganizationTable
          link={({ organization, children }) => (
            <Link
              key={organization.id}
              to={toEditOrganization({
                realm,
                id: organization.id!,
                tab: "settings",
              })}
            >
              {children}
            </Link>
          )}
          key={key}
          loader={loader}
          searchPlaceholderKey="searchOrganization"
          isPaginated
          toolbarItem={
            <ToolbarItem>
              <Button
                data-testid="addOrganization"
                component={(props) => (
                  <Link {...props} to={toAddOrganization({ realm })} />
                )}
              >
                {t("createOrganization")}
              </Button>
            </ToolbarItem>
          }
          onDelete={(org) => {
            setSelectedOrg(org);
            toggleDeleteDialog();
          }}
        >
          <ListEmptyState
            message={t("emptyOrganizations")}
            instructions={t("emptyOrganizationsInstructions")}
            primaryActionText={t("createOrganization")}
            onPrimaryAction={() => navigate(toAddOrganization({ realm }))}
          />
        </OrganizationTable>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/organizations/")({
  component: OrganizationsSection,
})
