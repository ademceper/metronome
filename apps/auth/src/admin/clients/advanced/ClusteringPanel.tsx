/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/advanced/ClusteringPanel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { Collapsible as UICollapsible, CollapsibleContent as UICollapsibleContent, CollapsibleTrigger as UICollapsibleTrigger } from "@metronome/ui/components/collapsible";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { FormAccess } from "../../components/form/FormAccess";
import { ListEmptyState } from "../../../shared/keycloak-ui-shared";
import { Action, KeycloakDataTable } from "../../../shared/keycloak-ui-shared";
import { TimeSelectorForm } from "../../components/time-selector/TimeSelectorForm";
import useFormatDate, { FORMAT_DATE_AND_TIME } from "../../utils/useFormatDate";
import { AddHostDialog } from ".././advanced/AddHostDialog";
import { AdvancedProps, parseResult } from "../AdvancedTab";


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
const ExpandableSection = ({ toggleText, toggleTextExpanded, toggleTextCollapsed, isExpanded, onToggle, isDetached, children, ...props }: any) => (
  <UICollapsible open={isExpanded} onOpenChange={(open: boolean) => onToggle?.(undefined, open)} {...props}>
    <UICollapsibleTrigger className="flex items-center gap-2 text-sm">
      {isExpanded ? (toggleTextExpanded ?? toggleText) : (toggleTextCollapsed ?? toggleText)}
    </UICollapsibleTrigger>
    <UICollapsibleContent>{children}</UICollapsibleContent>
  </UICollapsible>
);
const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
);
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

type Node = {
  host: string;
  registration: string;
};

export const ClusteringPanel = ({
  save,
  client: { id, registeredNodes, access },
}: AdvancedProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const formatDate = useFormatDate();

  const [nodes, setNodes] = useState(registeredNodes || {});
  const [expanded, setExpanded] = useState(false);
  const [selectedNode, setSelectedNode] = useState("");
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  const testCluster = async () => {
    const result = await adminClient.clients.testNodesAvailable({ id: id! });
    parseResult(result, "testCluster", addAlert, t);
  };

  const [toggleDeleteNodeConfirm, DeleteNodeConfirm] = useConfirmDialog({
    titleKey: "deleteNode",
    messageKey: t("deleteNodeBody", {
      node: selectedNode,
    }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.clients.deleteClusterNode({
          id: id!,
          node: selectedNode,
        });
        setNodes({
          ...Object.keys(nodes).reduce((object: any, key) => {
            if (key !== selectedNode) {
              object[key] = nodes[key];
            }
            return object;
          }, {}),
        });
        refresh();
        addAlert(t("deleteNodeSuccess"), AlertVariant.success);
      } catch (error) {
        addError("deleteNodeFail", error);
      }
    },
  });

  return (
    <>
      <FormAccess
        role="manage-clients"
        fineGrainedAccess={access?.configure}
        isHorizontal
      >
        <FormGroup
          label={t("nodeReRegistrationTimeout")}
          fieldId="kc-node-reregistration-timeout"
          labelIcon={
            <HelpItem
              helpText={t("nodeReRegistrationTimeoutHelp")}
              fieldLabelId="nodeReRegistrationTimeout"
            />
          }
        >
          <Split hasGutter>
            <SplitItem>
              <TimeSelectorForm name="nodeReRegistrationTimeout" />
            </SplitItem>
            <SplitItem>
              <Button variant={ButtonVariant.secondary} onClick={() => save()}>
                {t("save")}
              </Button>
            </SplitItem>
          </Split>
        </FormGroup>
      </FormAccess>
      <>
        <DeleteNodeConfirm />
        <AddHostDialog
          clientId={id!}
          isOpen={addNodeOpen}
          onAdded={(node) => {
            nodes[node] = Date.now() / 1000;
            refresh();
          }}
          onClose={() => setAddNodeOpen(false)}
        />
        <ExpandableSection
          toggleText={t("registeredClusterNodes")}
          onToggle={(_event, val) => setExpanded(val)}
          isExpanded={expanded}
        >
          <KeycloakDataTable
            key={key}
            ariaLabelKey="registeredClusterNodes"
            loader={() =>
              Promise.resolve<Node[]>(
                Object.entries(nodes || {}).map((entry) => {
                  return { host: entry[0], registration: entry[1] };
                }),
              )
            }
            toolbarItem={
              <>
                <ToolbarItem>
                  <Button
                    id="testClusterAvailability"
                    data-testid="test-cluster-availability"
                    onClick={testCluster}
                    variant={ButtonVariant.secondary}
                    isDisabled={Object.keys(nodes).length === 0}
                  >
                    {t("testClusterAvailability")}
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    id="registerNodeManually"
                    data-testid="registerNodeManually"
                    onClick={() => setAddNodeOpen(true)}
                    variant={ButtonVariant.tertiary}
                  >
                    {t("registerNodeManually")}
                  </Button>
                </ToolbarItem>
              </>
            }
            actions={[
              {
                title: t("delete"),
                onRowClick: (node) => {
                  setSelectedNode(node.host);
                  toggleDeleteNodeConfirm();
                },
              } as Action<Node>,
            ]}
            columns={[
              {
                name: "host",
                displayKey: "nodeHost",
              },
              {
                name: "registration",
                displayKey: "lastRegistration",
                cellFormatters: [
                  (value) =>
                    value
                      ? formatDate(
                          new Date(parseInt(value.toString()) * 1000),
                          FORMAT_DATE_AND_TIME,
                        )
                      : "",
                ],
              },
            ]}
            emptyState={
              <ListEmptyState
                message={t("noNodes")}
                instructions={t("noNodesInstructions")}
                primaryActionText={t("registerNodeManually")}
                onPrimaryAction={() => setAddNodeOpen(true)}
              />
            }
          />
        </ExpandableSection>
      </>
    </>
  );
};
