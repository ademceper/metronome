// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import yaml from "yaml";
import { useAdminClient } from "../../../../admin-client";
import {
  HelpItem,
  FormSubmitButton,
  useAlerts,
  useFetch,
} from "../../../../../shared/keycloak-ui-shared";
import { useRealm } from "../../../../context/realm-context/realm-context";
import { FormAccess } from "../../../../components/form/form-access";
import { toWorkflows } from "../../../../lib/workflows";
import CodeEditor from "../../../../components/form/code-editor";
import { useParams } from "../../../../utils/use-params";
import {
  WorkflowDetailParams,
  toWorkflowDetail,
} from "../../../../lib/workflows";
import { ViewHeader } from "../../../../components/view-header/view-header";
import WorkflowRepresentation from "libs/keycloak-admin-client/lib/defs/workflowRepresentation";

const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;

type AttributeForm = {
  workflowYAML: string;
};

function WorkflowDetailForm() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();
  const { mode, id } = useParams<WorkflowDetailParams>();
  const form = useForm<AttributeForm>({
    mode: "onChange",
    defaultValues: {
      workflowYAML: "",
    },
  });
  const { control, handleSubmit, setValue } = form;

  useFetch(
    async () => {
      if (mode === "create") {
        return undefined;
      }
      return adminClient.workflows.findOne({
        id: id!,
        includeId: false,
      });
    },
    (workflow) => {
      if (!workflow) {
        return;
      }

      const workflowToSet = { ...workflow };
      if (mode === "copy") {
        delete workflowToSet.id;
        workflowToSet.name = `${workflow.name} -- ${t("copy")}`;
      }

      setValue("workflowYAML", yaml.stringify(workflowToSet));
    },
    [mode, id, setValue, t],
  );

  const validateworkflowYAML = (yamlStr: string): WorkflowRepresentation => {
    const json: WorkflowRepresentation = yaml.parse(yamlStr);
    if (!json.name) {
      throw new Error(t("workflowNameRequired"));
    }
    return json;
  };

  const onUpdate: SubmitHandler<AttributeForm> = async (data) => {
    try {
      const json = validateworkflowYAML(data.workflowYAML);
      await adminClient.workflows.update({ id }, json);
      addAlert(t("workflowUpdated"), AlertVariant.success);
    } catch (error) {
      addError("workflowUpdateError", error);
    }
  };

  const onCreate: SubmitHandler<AttributeForm> = async (data) => {
    try {
      await adminClient.workflows.createAsYaml({
        realm,
        yaml: data.workflowYAML,
      });
      addAlert(t("workflowCreated"), AlertVariant.success);
      navigate(toWorkflows({ realm }));
    } catch (error) {
      addError("workflowCreateError", error);
    }
  };

  const titlekeyMap: Record<WorkflowDetailParams["mode"], string> = {
    copy: "copyWorkflow",
    create: "createWorkflow",
    update: "updateWorkflow",
  };

  const subkeyMap: Record<WorkflowDetailParams["mode"], string> = {
    copy: "copyWorkflowDetails",
    create: "createWorkflowDetails",
    update: "updateWorkflowDetails",
  };

  return (
    <>
      <ViewHeader titleKey={titlekeyMap[mode]} subKey={subkeyMap[mode]} />

      <FormProvider {...form}>
        <PageSection variant="light">
          <FormAccess
            isHorizontal
            onSubmit={
              mode === "update"
                ? handleSubmit(onUpdate)
                : handleSubmit(onCreate)
            }
            role={"manage-realm"}
            className="pf-v5-u-mt-lg"
            fineGrainedAccess={true}
          >
            <FormGroup
              label={t("workflowYAML")}
              labelIcon={
                <HelpItem
                  helpText={t("workflowYAMLHelp")}
                  fieldLabelId="code"
                />
              }
              fieldId="code"
              isRequired
            >
              <Controller
                name="workflowYAML"
                control={control}
                render={({ field }) => (
                  <CodeEditor
                    id="workflowYAML"
                    data-testid="workflowYAML"
                    value={field.value}
                    onChange={field.onChange}
                    language="yaml"
                    height={600}
                  />
                )}
              />
            </FormGroup>
            <ActionGroup>
              <FormSubmitButton
                formState={form.formState}
                data-testid="save"
                allowInvalid
                allowNonDirty
                isDisabled={mode === "create" && !form.formState.isDirty}
              >
                {mode === "update" ? t("save") : t("create")}
              </FormSubmitButton>
              {mode === "update" && (
                <Button
                  data-testid="copy"
                  variant="link"
                  component={(props) => (
                    <Link
                      {...props}
                      to={toWorkflowDetail({ realm, mode: "copy", id: id! })}
                    />
                  )}
                >
                  {t("copy")}
                </Button>
              )}
              <Button
                data-testid="cancel"
                variant="link"
                component={(props) => (
                  <Link {...props} to={toWorkflows({ realm })} />
                )}
              >
                {t("cancel")}
              </Button>
            </ActionGroup>
          </FormAccess>
        </PageSection>
      </FormProvider>
    </>
  );
}

export const Route = createFileRoute("/$realm/workflows/$mode/$id")({
  component: WorkflowDetailForm,
})
