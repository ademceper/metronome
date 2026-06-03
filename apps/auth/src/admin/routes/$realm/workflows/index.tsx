// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { Button as UIButton } from "@metronome/ui/components/button";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { Action, DataTable } from "@metronome/ui/components/data-table";
import { ListEmptyState } from "@metronome/ui/components/list-empty-state";
import WorkflowRepresentation from "@keycloak/keycloak-admin-client/lib/defs/workflowRepresentation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { ViewHeader } from "../../../components/view-header/ViewHeader";
import { useRealm } from "../../../context/realm-context/realm-context";
import helpUrls from "../../../help-urls";
import { useConfirmDialog } from "../../../components/confirm-dialog/ConfirmDialog";
import { toWorkflowDetail } from "../../../lib/workflows";

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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);

function WorkflowsSection() {
  const { adminClient } = useAdminClient();

  const { realm } = useRealm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addAlert, addError } = useAlerts();

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [selectedWorkflow, setSelectedWorkflow] =
    useState<WorkflowRepresentation>();

  const loader = async () => {
    const workflows = await adminClient.workflows.find();
    return workflows.sort(
      (a: WorkflowRepresentation, b: WorkflowRepresentation) => {
        const nameA = a.name ?? "";
        const nameB = b.name ?? "";
        return nameA.localeCompare(nameB);
      },
    );
  };

  const toggleEnabled = async (workflow: WorkflowRepresentation) => {
    const enabled = !(workflow.enabled ?? true);
    const workflowToUpdate = { ...workflow, enabled };
    try {
      await adminClient.workflows.update(
        { id: workflow.id! },
        workflowToUpdate,
      );

      addAlert(
        workflowToUpdate.enabled ? t("workflowEnabled") : t("workflowDisabled"),
        AlertVariant.success,
      );
      refresh();
    } catch (error) {
      addError("workflowUpdateError", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "workflowDeleteConfirm",
    messageKey: t("workflowDeleteConfirmDialog", {
      selectedRoleName: selectedWorkflow ? selectedWorkflow!.name : "",
    }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.workflows.delById({ id: selectedWorkflow!.id! });
        setSelectedWorkflow(undefined);
        addAlert(t("workflowDeletedSuccess"), AlertVariant.success);
        refresh();
      } catch (error) {
        addError("workflowDeleteError", error);
      }
    },
  });

  return (
    <>
      <ViewHeader
        titleKey="titleWorkflows"
        subKey="workflowsExplain"
        helpUrl={helpUrls.workflowsUrl}
      />
      <PageSection variant="light" padding={{ default: "noPadding" }}>
        <DeleteConfirm />
        <DataTable
          t={t}
          key={key}
          toolbarItem={
            <Button
              data-testid="create-workflow"
              component={(props) => (
                <Link
                  {...props}
                  to={toWorkflowDetail({ realm, mode: "create", id: "new" })}
                />
              )}
            >
              {t("createWorkflow")}
            </Button>
          }
          columns={[
            {
              name: "name",
              displayKey: "name",
              cellRenderer: (row: WorkflowRepresentation) => (
                <Link
                  to={toWorkflowDetail({ realm, mode: "update", id: row.id! })}
                >
                  {row.name}
                </Link>
              ),
            },
            {
              name: "id",
              displayKey: "id",
            },
            {
              name: "status",
              displayKey: "status",
              cellRenderer: (workflow: WorkflowRepresentation) => (
                <Switch
                  data-testid={`toggle-enabled-${workflow.name}`}
                  label={t("enabled")}
                  labelOff={t("disabled")}
                  isChecked={workflow.enabled ?? true}
                  onChange={() => toggleEnabled(workflow)}
                />
              ),
            },
          ]}
          actions={[
            {
              title: t("delete"),
              onRowClick: (workflow) => {
                setSelectedWorkflow(workflow);
                toggleDeleteDialog();
              },
            } as Action<WorkflowRepresentation>,
            {
              title: t("copy"),
              onRowClick: (workflow) => {
                setSelectedWorkflow(workflow);
                navigate(
                  toWorkflowDetail({ realm, mode: "copy", id: workflow.id! }),
                );
              },
            } as Action<WorkflowRepresentation>,
          ]}
          loader={loader}
          ariaLabelKey="workflows"
          emptyState={
            <ListEmptyState
              message={t("emptyWorkflows")}
              instructions={t("emptyWorkflowsInstructions")}
              primaryActionText={t("createWorkflow")}
              onPrimaryAction={() =>
                navigate(toWorkflowDetail({ realm, mode: "create", id: "new" }))
              }
            />
          }
        />
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/workflows/")({
  component: WorkflowsSection,
})
