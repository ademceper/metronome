// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import type { ComponentQuery } from "@keycloak/keycloak-admin-client/lib/resources/components";
import {
  KeycloakDataTable,
  ListEmptyState,
  useAlerts,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";

type IRowData = any;
import { get } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { ViewHeader } from "../../components/view-header/ViewHeader";
import { useRealm } from "../../context/realm-context/RealmContext";
import { useServerInfo } from "../../context/server-info/ServerInfoProvider";
import { PAGE_PROVIDER } from "../../components/page/constants";
import { addDetailPage, PageListParams, toDetailPage } from "../../lib/page";


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

type DetailLinkProps = {
  obj: ComponentRepresentation;
  field: string;
};

const DetailLink = ({ obj, field }: DetailLinkProps) => {
  const { realm } = useRealm();
  const value = get(obj, field);
  return (
    <Link
      key={value}
      to={toDetailPage({ realm, providerId: obj.providerId!, id: obj.id! })}
    >
      {value}
    </Link>
  );
};
function PageList() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const navigate = useNavigate();
  const { providerId } = useParams<PageListParams>();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const { realm: realmName, realmRepresentation: realm } = useRealm();
  const [selectedItem, setSelectedItem] = useState<ComponentRepresentation>();
  const { componentTypes } = useServerInfo();
  const pages = componentTypes?.[PAGE_PROVIDER];

  const page = pages?.find((p) => p.id === providerId)!;

  const loader = async () => {
    const params: ComponentQuery = {
      parent: realm?.id,
      type: PAGE_PROVIDER,
      providerId,
    };
    return await adminClient.components.find({ ...params });
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "itemDeleteConfirmTitle",
    messageKey: "itemDeleteConfirm",
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.components.del({
          id: selectedItem!.id!,
        });
        addAlert(t("itemDeletedSuccess"));
        refresh();
      } catch (error) {
        addError("itemSaveError", error);
      }
    },
  });

  return (
    <PageSection variant="light" className="pf-v5-u-p-0">
      <DeleteConfirm />
      <ViewHeader titleKey={page.id} subKey={page.helpText} divider={false} />
      <KeycloakDataTable
        key={key}
        toolbarItem={
          <ToolbarItem>
            <Button
              component={(props) => (
                <Link
                  {...props}
                  to={addDetailPage({ realm: realmName, providerId: page.id })}
                />
              )}
            >
              {t("createItem")}
            </Button>
          </ToolbarItem>
        }
        actionResolver={(item: IRowData) => [
          {
            title: t("delete"),
            onClick() {
              setSelectedItem(item.data);
              toggleDeleteDialog();
            },
          },
        ]}
        searchPlaceholderKey="searchItem"
        loader={loader}
        columns={[
          ...(
            page.metadata.displayFields ||
            page.properties.slice(0, 3).map((p) => p.name)
          ).map((name: string, index: number) => ({
            name: `config.${name}[0]`,
            displayKey: page.properties.find((p) => p.name === name)!.label,
            cellRenderer:
              index === 0
                ? (obj: ComponentRepresentation) => (
                    <DetailLink obj={obj} field={`config.${name}`} />
                  )
                : undefined,
          })),
        ]}
        ariaLabelKey="list"
        emptyState={
          <ListEmptyState
            hasIcon
            message={t("noItems")}
            instructions={t("noItemsInstructions")}
            primaryActionText={t("createItem")}
            onPrimaryAction={() =>
              navigate(addDetailPage({ realm: realmName, providerId: page.id }))
            }
          />
        }
      />
    </PageSection>
  );
}

export const Route = createFileRoute("/page-section/$providerId")({
  component: PageList,
})
