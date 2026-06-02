// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import AuthenticationFlowRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticationFlowRepresentation";
import type { AuthenticationProviderRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigRepresentation";
import AuthenticatorConfigRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigRepresentation";
import { useAlerts, useFetch } from "../../../../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { ToggleGroup as UIToggleGroup, ToggleGroupItem as UIToggleGroupItem } from "@metronome/ui/components/toggle-group";
import { cn } from "@metronome/ui/lib/utils";
import { Globe as DomainIcon, Table as TableIcon } from "@phosphor-icons/react"
import {
  Table,
  TableBody as Tbody,
} from "@metronome/ui/components/table";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminClient } from "../../../../../admin-client";
import { useConfirmDialog } from "../../../../../components/confirm-dialog/ConfirmDialog";
import { ViewHeader } from "../../../../../components/view-header/ViewHeader";
import { useRealm } from "../../../../../context/realm-context/realm-context";
import useToggle from "../../../../../utils/use-toggle";
import { BindFlowDialog } from "../../../../../components/authentication/BindFlowDialog";
import { BuildInLabel } from "../../../../../components/authentication/BuildInLabel";
import { DuplicateFlowModal } from "../../../../../components/authentication/DuplicateFlowModal";
import { EditFlowModal } from "../../../../../components/authentication/EditFlowModal";
import { EmptyExecutionState } from "../../../../../components/authentication/EmptyExecutionState";
import { AuthenticationProviderContextProvider } from "../../../../../components/authentication/components/AuthenticationProviderContext";
import { FlowDiagram } from "../../../../../components/authentication/components/FlowDiagram";
import { FlowHeader } from "../../../../../components/authentication/components/FlowHeader";
import { FlowRow } from "../../../../../components/authentication/components/FlowRow";
import { AddStepModal } from "../../../../../components/authentication/components/modals/AddStepModal";
import { AddSubFlowModal, Flow } from "../../../../../components/authentication/components/modals/AddSubFlowModal";
import {
  ExecutionList,
  ExpandableExecution,
  IndexChange,
  LevelChange,
} from "../../../../../components/authentication/execution-model";
import { toAuthentication } from "../../../../../lib/authentication";
import { toFlow, type FlowParams } from "../../../../../lib/authentication";

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
const DragDrop = ({ onDrag, onDrop, children, ...props }: any) => (
  <div {...props}>{children}</div>
);
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const Droppable = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);
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
const ToggleGroup = ({ children, ...props }: any) => (
  <UIToggleGroup type="single" {...props}>{children}</UIToggleGroup>
);
const ToggleGroupItem = ({ text, buttonId, isSelected, onChange, children, ...props }: any) => (
  <UIToggleGroupItem value={buttonId ?? String(text)}
    onClick={(e: any) => onChange?.(e, !isSelected)} {...props}>
    {text ?? children}
  </UIToggleGroupItem>
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

export const providerConditionFilter = (
  value: AuthenticationProviderRepresentation,
) => value.displayName?.startsWith("Condition ");

function FlowDetails() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();
  const { id, usedBy, builtIn } = useParams<FlowParams>();
  const navigate = useNavigate();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  const [tableView, setTableView] = useState(true);
  const [flow, setFlow] = useState<AuthenticationFlowRepresentation>();
  const [executionList, setExecutionList] = useState<ExecutionList>();
  const [liveText, setLiveText] = useState("");

  const [showAddExecutionDialog, setShowAddExecutionDialog] =
    useState<boolean>();
  const [showAddSubFlowDialog, setShowSubFlowDialog] = useState<boolean>();
  const [selectedExecution, setSelectedExecution] =
    useState<ExpandableExecution>();
  const [open, toggleOpen, setOpen] = useToggle();
  const [edit, setEdit] = useState(false);
  const [bindFlowOpen, toggleBindFlow] = useToggle();

  useFetch(
    async () => {
      const flows = await adminClient.authenticationManagement.getFlows();
      const flow = flows.find((f) => f.id === id);
      if (!flow) {
        throw new Error(t("notFound"));
      }

      const executions =
        await adminClient.authenticationManagement.getExecutions({
          flow: flow.alias!,
        });
      return { flow, executions };
    },
    ({ flow, executions }) => {
      setFlow(flow);
      setExecutionList(new ExecutionList(executions));
    },
    [key],
  );

  const executeChange = async (
    ex: AuthenticationFlowRepresentation | ExpandableExecution,
    change: LevelChange | IndexChange,
  ) => {
    try {
      let id = ex.id!;
      if ("parent" in change) {
        let config: AuthenticatorConfigRepresentation = {};
        if ("authenticationConfig" in ex) {
          config = await adminClient.authenticationManagement.getConfig({
            id: ex.authenticationConfig as string,
          });
        }

        try {
          await adminClient.authenticationManagement.delExecution({ id });
        } catch {
          // skipping already deleted execution
        }
        if ("authenticationFlow" in ex) {
          const executionFlow = ex as ExpandableExecution;
          const result =
            await adminClient.authenticationManagement.addFlowToFlow({
              flow: change.parent?.displayName! || flow?.alias!,
              alias: executionFlow.displayName!,
              description: executionFlow.description!,
              provider: ex.providerId!,
              type: "basic-flow",
            });
          id = result.id!;
          ex.executionList?.forEach((e, i) =>
            executeChange(e, {
              parent: { ...ex, id: result.id },
              newIndex: i,
              oldIndex: i,
            }),
          );
        } else {
          const result =
            await adminClient.authenticationManagement.addExecutionToFlow({
              flow: change.parent?.displayName! || flow?.alias!,
              provider: ex.providerId!,
            });

          if (config.id) {
            const newConfig = {
              id: result.id,
              alias: config.alias,
              config: config.config,
            };
            await adminClient.authenticationManagement.createConfig(newConfig);
          }

          id = result.id!;
        }
      }
      const times = change.newIndex - change.oldIndex;
      for (let index = 0; index < Math.abs(times); index++) {
        if (times > 0) {
          await adminClient.authenticationManagement.lowerPriorityExecution({
            id,
          });
        } else {
          await adminClient.authenticationManagement.raisePriorityExecution({
            id,
          });
        }
      }
      refresh();
      addAlert(t("updateFlowSuccess"), AlertVariant.success);
    } catch (error: any) {
      addError("updateFlowError", error);
    }
  };

  const update = async (execution: ExpandableExecution) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { executionList, isCollapsed, ...ex } = execution;
    try {
      await adminClient.authenticationManagement.updateExecution(
        { flow: flow?.alias! },
        ex,
      );
      refresh();
      addAlert(t("updateFlowSuccess"), AlertVariant.success);
    } catch (error: any) {
      addError("updateFlowError", error);
    }
  };

  const addExecution = async (
    name: string,
    type: AuthenticationProviderRepresentation,
  ) => {
    try {
      await adminClient.authenticationManagement.addExecutionToFlow({
        flow: name,
        provider: type.id!,
      });
      refresh();
      addAlert(t("updateFlowSuccess"), AlertVariant.success);
    } catch (error) {
      addError("updateFlowError", error);
    }
  };

  const addFlow = async (
    flow: string,
    { name, description = "", type, provider }: Flow,
  ) => {
    try {
      await adminClient.authenticationManagement.addFlowToFlow({
        flow,
        alias: name,
        description,
        provider,
        type,
      });
      refresh();
      addAlert(t("updateFlowSuccess"), AlertVariant.success);
    } catch (error) {
      addError("updateFlowError", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteConfirmExecution", {
      name: selectedExecution?.displayName,
    }),
    children: (
      <Trans i18nKey="deleteConfirmExecutionMessage">
        {" "}
        <strong>{{ name: selectedExecution?.displayName }}</strong>.
      </Trans>
    ),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.authenticationManagement.delExecution({
          id: selectedExecution?.id!,
        });
        addAlert(t("deleteExecutionSuccess"), AlertVariant.success);
        refresh();
      } catch (error) {
        addError("deleteExecutionError", error);
      }
    },
  });

  const [toggleDeleteFlow, DeleteFlowConfirm] = useConfirmDialog({
    titleKey: "deleteConfirmFlow",
    children: (
      <Trans i18nKey="deleteConfirmFlowMessage">
        {" "}
        <strong>{{ flow: flow?.alias || "" }}</strong>.
      </Trans>
    ),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.authenticationManagement.deleteFlow({
          flowId: flow!.id!,
        });
        navigate(toAuthentication({ realm }));
        addAlert(t("deleteFlowSuccess"), AlertVariant.success);
      } catch (error) {
        addError("deleteFlowError", error);
      }
    },
  });

  const hasExecutions = executionList?.expandableList.length !== 0;

  const dropdownItems = [
    ...(usedBy !== "DEFAULT"
      ? [
          <DropdownItem
            data-testid="set-as-default"
            key="default"
            onClick={toggleBindFlow}
          >
            {t("bindFlow")}
          </DropdownItem>,
        ]
      : []),
    <DropdownItem key="duplicate" onClick={() => setOpen(true)}>
      {t("duplicate")}
    </DropdownItem>,
    ...(!builtIn
      ? [
          <DropdownItem
            data-testid="edit-flow"
            key="edit"
            onClick={() => setEdit(true)}
          >
            {t("editInfo")}
          </DropdownItem>,
        ]
      : []),
    ...(!builtIn && !usedBy
      ? [
          <DropdownItem
            data-testid="delete-flow"
            key="delete"
            onClick={() => toggleDeleteFlow()}
          >
            {t("delete")}
          </DropdownItem>,
        ]
      : []),
  ];

  return (
    <AuthenticationProviderContextProvider>
      {bindFlowOpen && (
        <BindFlowDialog
          flowAlias={flow?.alias!}
          onClose={(usedBy) => {
            toggleBindFlow();
            navigate(
              toFlow({
                realm,
                id: id!,
                usedBy: usedBy ? "DEFAULT" : "notInUse",
                builtIn: builtIn ? "builtIn" : undefined,
              }),
            );
          }}
        />
      )}
      {open && flow && (
        <DuplicateFlowModal
          name={flow.alias!}
          description={flow.description!}
          toggleDialog={toggleOpen}
          onComplete={() => {
            refresh();
            setOpen(false);
          }}
        />
      )}
      {edit && (
        <EditFlowModal
          flow={flow!}
          toggleDialog={() => {
            setEdit(!edit);
            refresh();
          }}
        />
      )}
      <DeleteFlowConfirm />

      <ViewHeader
        titleKey={flow?.alias || ""}
        badges={[
          { text: <Label>{t(`used.${usedBy}`)}</Label> },
          builtIn
            ? {
                text: <BuildInLabel />,
                id: "builtIn",
              }
            : {},
        ]}
        dropdownItems={dropdownItems}
      />
      <PageSection variant="light">
        {executionList && hasExecutions && (
          <>
            <Toolbar id="toolbar">
              <ToolbarContent>
                <ToolbarItem>
                  <ToggleGroup>
                    <ToggleGroupItem
                      icon={<TableIcon />}
                      aria-label={t("tableView")}
                      buttonId="tableView"
                      isSelected={tableView}
                      onChange={() => setTableView(true)}
                    />
                    <ToggleGroupItem
                      icon={<DomainIcon />}
                      aria-label={t("diagramView")}
                      buttonId="diagramView"
                      isSelected={!tableView}
                      onChange={() => setTableView(false)}
                    />
                  </ToggleGroup>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    data-testid="addStep"
                    variant="secondary"
                    onClick={() => setShowAddExecutionDialog(true)}
                  >
                    {t("addExecution")}
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    data-testid="addSubFlow"
                    variant="secondary"
                    onClick={() => setShowSubFlowDialog(true)}
                  >
                    {t("addSubFlow")}
                  </Button>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <DeleteConfirm />
            {tableView && (
              <DragDrop
                onDrag={({ index }) => {
                  const item = executionList.findExecution(index)!;
                  setLiveText(t("onDragStart", { item: item.displayName }));
                  if (!item.isCollapsed) {
                    item.isCollapsed = true;
                    setExecutionList(executionList.clone());
                  }
                  return true;
                }}
                onDragMove={({ index }) => {
                  const dragged = executionList.findExecution(index);
                  setLiveText(t("onDragMove", { item: dragged?.displayName }));
                }}
                onDrop={(source, dest) => {
                  if (dest) {
                    const dragged = executionList.findExecution(source.index)!;
                    const order = executionList.order().map((ex) => ex.id!);
                    setLiveText(
                      t("onDragFinish", { list: dragged.displayName }),
                    );

                    const [removed] = order.splice(source.index, 1);
                    order.splice(dest.index, 0, removed);
                    const change = executionList.getChange(dragged, order);
                    void executeChange(dragged, change);
                    return true;
                  } else {
                    setLiveText(t("onDragCancel"));
                    return false;
                  }
                }}
              >
                <Droppable hasNoWrapper>
                  <Table aria-label={t("flows")} isTreeTable>
                    <FlowHeader />
                    <>
                      {executionList.expandableList.map((execution) => (
                        <Tbody draggable key={execution.id}>
                          <FlowRow
                            builtIn={!!builtIn}
                            execution={execution}
                            onRowClick={(execution) => {
                              execution.isCollapsed = !execution.isCollapsed;
                              setExecutionList(executionList.clone());
                            }}
                            onRowChange={update}
                            onAddExecution={(execution, type) =>
                              addExecution(execution.displayName!, type)
                            }
                            onAddFlow={(execution, flow) =>
                              addFlow(execution.displayName!, flow)
                            }
                            onDelete={(execution) => {
                              setSelectedExecution(execution);
                              toggleDeleteDialog();
                            }}
                          />
                        </Tbody>
                      ))}
                    </>
                  </Table>
                </Droppable>
              </DragDrop>
            )}
            {flow && (
              <>
                {showAddExecutionDialog && (
                  <AddStepModal
                    name={flow.alias!}
                    type={
                      flow.providerId === "client-flow" ? "client" : "basic"
                    }
                    onSelect={async (type) => {
                      if (type) {
                        await addExecution(flow.alias!, type);
                      }
                      setShowAddExecutionDialog(false);
                    }}
                  />
                )}
                {showAddSubFlowDialog && (
                  <AddSubFlowModal
                    name={flow.alias!}
                    onCancel={() => setShowSubFlowDialog(false)}
                    onConfirm={async (newFlow) => {
                      await addFlow(flow.alias!, newFlow);
                      setShowSubFlowDialog(false);
                    }}
                  />
                )}
              </>
            )}
            <div className="pf-v5-screen-reader" aria-live="assertive">
              {liveText}
            </div>
          </>
        )}
        {!tableView && executionList?.expandableList && (
          <FlowDiagram executionList={executionList} />
        )}
        {!executionList?.expandableList ||
          (flow && !hasExecutions && (
            <EmptyExecutionState
              flow={flow}
              onAddExecution={(type) => addExecution(flow.alias!, type)}
              onAddFlow={(newFlow) => addFlow(flow.alias!, newFlow)}
            />
          ))}
      </PageSection>
    </AuthenticationProviderContextProvider>
  );
}

export const Route = createFileRoute("/$realm/authentication/$id/$usedBy/$builtIn")({
  component: FlowDetails,
})
