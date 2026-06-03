// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { fetchWithError } from "@keycloak/keycloak-admin-client";
import { KeycloakSpinner, useAlerts } from "../../../../shared/keycloak-ui-shared";
import { DataTable } from "@metronome/ui/components/table/data-table";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { sortBy } from "lodash-es";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { useConfirmDialog } from "../../../components/confirm-dialog/ConfirmDialog";
import {
  RoutableTabs,
  useRoutableTab,
} from "../../../components/routable-tabs/RoutableTabs";
import { ViewHeader } from "../../../components/view-header/ViewHeader";
import { useRealm } from "../../../context/realm-context/realm-context";
import helpUrls from "../../../help-urls";
import { addTrailingSlash } from "../../../util";
import { getAuthorizationHeaders } from "../../../utils/get-authorization-headers";
import useLocaleSort, { mapByKey } from "../../../utils/use-locale-sort";
import useToggle from "../../../utils/use-toggle";
import { BindFlowDialog } from "../../../components/authentication/BindFlowDialog";
import { DuplicateFlowModal } from "../../../components/authentication/DuplicateFlowModal";
import { RequiredActions } from "../../../components/authentication/RequiredActions";
import { UsedBy } from "../../../components/authentication/components/UsedBy";
import { AuthenticationType } from "../../../components/authentication/constants";
import { Policies } from "../../../components/authentication/policies/Policies";
import { AuthenticationTab, toAuthentication } from "../../../lib/authentication";
import { toCreateFlow } from "../../../lib/authentication";
import { toFlow } from "../../../lib/authentication";
import { Tab, TabTitleText } from "../../../../shared/pf-compat"


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
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
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

const AliasRenderer = ({ id, alias, usedBy, builtIn }: AuthenticationType) => {
  const { t } = useTranslation();
  const { realm } = useRealm();

  return (
    <>
      <Link
        to={toFlow({
          realm,
          id: id!,
          usedBy: usedBy?.type || "notInUse",
          builtIn: builtIn ? "builtIn" : undefined,
        })}
        key={`link-${id}`}
      >
        {alias}
      </Link>{" "}
      {builtIn && <Label key={`label-${id}`}>{t("buildIn")}</Label>}
    </>
  );
};

function AuthenticationSection() {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const { realm: realmName, realmRepresentation: realm } = useRealm();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const { addAlert, addError } = useAlerts();
  const localeSort = useLocaleSort();
  const [selectedFlow, setSelectedFlow] = useState<AuthenticationType>();
  const [open, toggleOpen] = useToggle();
  const [bindFlowOpen, toggleBindFlow] = useToggle();

  const loader = async () => {
    const flowsRequest = await fetchWithError(
      `${addTrailingSlash(
        adminClient.baseUrl,
      )}admin/realms/${realmName}/ui-ext/authentication-management/flows`,
      {
        method: "GET",
        headers: getAuthorizationHeaders(await adminClient.getAccessToken()),
      },
    );
    const flows = await flowsRequest.json();

    if (!flows) {
      return [];
    }

    return sortBy(
      localeSort<AuthenticationType>(flows, mapByKey("alias")),
      (flow) => flow.usedBy?.type,
    );
  };

  const useTab = (tab: AuthenticationTab) =>
    useRoutableTab(toAuthentication({ realm: realmName, tab }));

  const flowsTab = useTab("flows");
  const requiredActionsTab = useTab("required-actions");
  const policiesTab = useTab("policies");

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deleteConfirmFlow",
    children: (
      <Trans i18nKey="deleteConfirmFlowMessage">
        {" "}
        <strong>{{ flow: selectedFlow ? selectedFlow.alias : "" }}</strong>.
      </Trans>
    ),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.authenticationManagement.deleteFlow({
          flowId: selectedFlow!.id!,
        });
        refresh();
        addAlert(t("deleteFlowSuccess"), AlertVariant.success);
      } catch (error) {
        addError("deleteFlowError", error);
      }
    },
  });

  if (!realm) return <KeycloakSpinner />;

  return (
    <>
      <DeleteConfirm />
      {open && selectedFlow && (
        <DuplicateFlowModal
          name={selectedFlow.alias!}
          description={selectedFlow.description!}
          toggleDialog={toggleOpen}
          onComplete={() => {
            refresh();
            toggleOpen();
          }}
        />
      )}
      {bindFlowOpen && (
        <BindFlowDialog
          onClose={() => {
            toggleBindFlow();
            refresh();
          }}
          flowAlias={selectedFlow?.alias!}
        />
      )}
      <ViewHeader
        titleKey="titleAuthentication"
        subKey="authenticationExplain"
        helpUrl={helpUrls.authenticationUrl}
        divider={false}
      />
      <PageSection variant="light" className="pf-v5-u-p-0">
        <RoutableTabs
          isBox
          defaultLocation={toAuthentication({ realm: realmName, tab: "flows" })}
        >
          <Tab
            data-testid="flows"
            title={<TabTitleText>{t("flows")}</TabTitleText>}
            {...flowsTab}
          >
            <DataTable
              t={t}
              key={key}
              loader={loader}
              ariaLabelKey="titleAuthentication"
              searchPlaceholderKey="searchForFlow"
              toolbarItem={
                <ToolbarItem>
                  <Button
                    component={(props) => (
                      <Link
                        {...props}
                        to={toCreateFlow({ realm: realmName })}
                      />
                    )}
                  >
                    {t("createFlow")}
                  </Button>
                </ToolbarItem>
              }
              actionResolver={({ data }) => [
                {
                  title: t("duplicate"),
                  onClick: () => {
                    toggleOpen();
                    setSelectedFlow(data);
                  },
                },
                ...(data.usedBy?.type !== "DEFAULT"
                  ? [
                      {
                        title: t("bindFlow"),
                        onClick: () => {
                          toggleBindFlow();
                          setSelectedFlow(data);
                        },
                      },
                    ]
                  : []),
                ...(!data.builtIn && !data.usedBy
                  ? [
                      {
                        title: t("delete"),
                        onClick: () => {
                          setSelectedFlow(data);
                          toggleDeleteDialog();
                        },
                      },
                    ]
                  : []),
              ]}
              columns={[
                {
                  name: "alias",
                  displayKey: "flowName",
                  cellRenderer: (row) => <AliasRenderer {...row} />,
                },
                {
                  name: "usedBy",
                  displayKey: "usedBy",
                  cellRenderer: (row) => <UsedBy authType={row} />,
                },
                {
                  name: "description",
                  displayKey: "description",
                },
              ]}
              emptyState={
                <ListEmptyState
                  message={t("emptyEvents")}
                  instructions={t("emptyEventsInstructions")}
                />
              }
            />
          </Tab>
          <Tab
            data-testid="requiredActions"
            title={<TabTitleText>{t("requiredActions")}</TabTitleText>}
            {...requiredActionsTab}
          >
            <RequiredActions />
          </Tab>
          <Tab
            data-testid="policies"
            title={<TabTitleText>{t("policies")}</TabTitleText>}
            {...policiesTab}
          >
            <Policies />
          </Tab>
        </RoutableTabs>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/authentication/$tab")({
  component: () => (
    <div className="[&_[data-slot=tabs-list]]:hidden">
      <AuthenticationSection />
    </div>
  ),
})
