/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/UserWorkflows.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { DataTable } from "@metronome/ui/components/table/data-table";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Accordion as UIAccordion, AccordionContent as UIAccordionContent, AccordionItem as UIAccordionItem, AccordionTrigger as UIAccordionTrigger } from "@metronome/ui/components/accordion";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@metronome/ui/components/popover";
import { cn } from "@metronome/ui/lib/utils";
import yaml from "yaml";
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table/table";
import { Question as QuestionCircleIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import useFormatDate from "../../utils/use-format-date";
import WorkflowRepresentation from "libs/keycloak-admin-client/lib/defs/workflowRepresentation";
import CodeEditor from "../form/code-editor";


const Accordion = ({ asDefinitionList, children, ...props }: any) => (
  <UIAccordion type="multiple" {...props}>{children}</UIAccordion>
);
const AccordionContent = ({ children, ...props }: any) => (
  <UIAccordionContent {...props}>{children}</UIAccordionContent>
);
const AccordionItem = ({ children, ...props }: any) => (
  <UIAccordionItem value={String((props as any).id ?? Math.random())} {...props}>{children}</UIAccordionItem>
);
const AccordionToggle = ({ onClick, isExpanded, children, ...props }: any) => (
  <UIAccordionTrigger onClick={onClick} {...props}>{children}</UIAccordionTrigger>
);
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
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

type UserWorkflowProps = {
  user?: string;
};

const WorkflowYAMLAccordion = ({ id, name }: { id: string; name: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [yamlContent, setYamlContent] = useState<string>("");
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();

  const onToggleWorkflowYaml = () => {
    if (expanded) {
      setExpanded(false);
    } else {
      setExpanded(true);
      void loadWorkflowYaml();
    }
  };

  const loadWorkflowYaml = async () => {
    const workflowYaml = await adminClient.workflows.findOne({
      id: id!,
      includeId: false,
    });
    setYamlContent(yaml.stringify(workflowYaml));
  };

  return (
    <Accordion asDefinitionList={true} isBordered togglePosition="start">
      <AccordionItem>
        <AccordionToggle
          onClick={() => {
            onToggleWorkflowYaml();
          }}
          isExpanded={expanded}
          id={`yaml-ex-toggle-${name}`}
          data-testid={`yaml-ex-toggle-${name}`}
        >
          {t("workflowYAML")}
        </AccordionToggle>
        <AccordionContent id={`ex-expand1-content-${id}`} isHidden={!expanded}>
          <CodeEditor
            id={`workflowYAML-${name}`}
            data-testid={`workflowYAML-${name}`}
            value={yamlContent}
            language="yaml"
            readOnly={true}
            height={300}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const StepsCell = (workflow: WorkflowRepresentation) => {
  const formatDate = useFormatDate();
  const { t } = useTranslation();

  return (
    <>
      <Table aria-label={workflow.name! + "-" + t("steps")} variant="compact">
        <Thead>
          <Tr>
            <Th>{t("step")}</Th>
            <Th>{t("scheduledAfter")}</Th>
            <Th>{t("status")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {workflow.steps?.map((step, idx) => (
            <Tr key={idx}>
              <Td>{step.uses}</Td>
              <Td>
                {step["scheduled-at"]
                  ? formatDate(new Date(step["scheduled-at"]!))
                  : ""}
              </Td>
              <Td>
                {step.status! === "COMPLETED" ? (
                  <Label color="green">{t("completed")}</Label>
                ) : (
                  <Label color="orange">{t("pending")}</Label>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <WorkflowYAMLAccordion id={workflow.id!} name={workflow.name!} />
    </>
  );
};

export const UserWorkflows = ({ user }: UserWorkflowProps) => {
  const [key, setKey] = useState(0);
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();

  const workflowsLoader = async () => {
    return adminClient.workflows.scheduled({
      userId: user!,
    });
  };

  const nextStepRenderer = (workflow: WorkflowRepresentation) => {
    if (!workflow.steps) return "";
    const found = workflow.steps.find((step) => step.status === "PENDING");
    if (found) {
      return found.uses;
    } else {
      return t("completed");
    }
  };

  return (
    <DataTable
      t={t}
      key={key}
      loader={workflowsLoader}
      ariaLabelKey="titleWorkflows"
      columns={[
        { name: "name", displayKey: "name" },
        {
          name: "nextStep",
          displayKey: "nextStep",
          cellRenderer: (row) => nextStepRenderer(row) || "",
        },
        {
          name: "steps",
          displayKey: "steps",
          cellRenderer: (row) => row.steps!.length.toString(),
        },
      ]}
      detailColumns={[
        {
          name: "details",
          enabled: () => {
            return true;
          },
          cellRenderer: StepsCell,
        },
      ]}
      isPaginated={false}
      toolbarItem={[
        <Popover
          key="who-will-appear-popover"
          aria-label={t("whichWorkflowsWillAppear")}
          position="bottom"
          bodyContent={<div>{t("whichWorkflowsWillAppearDetail")}</div>}
        >
          <Button
            variant="link"
            className="kc-who-will-appear-button"
            key="who-will-appear-button"
            icon={<QuestionCircleIcon />}
          >
            {t("whichWorkflowsWillAppear")}
          </Button>
        </Popover>,
      ]}
      searchPlaceholderKey="searchByName"
      emptyState={
        <ListEmptyState
          message={t("emptyWorkflows")}
          instructions={t("emptyUserWorkflowsInstructions")}
          primaryActionText={t("refresh")}
          onPrimaryAction={() => setKey(key + 1)}
        />
      }
    />
  );
};
