// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type ProtocolMapperRepresentation from "@keycloak/keycloak-admin-client/lib/defs/protocolMapperRepresentation";
import type { ProtocolMapperTypeRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/serverInfoRepesentation";
import {
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../../../../admin-client";
import { toDedicatedScope } from "../../../../../../../../lib/clients";
import { useConfirmDialog } from "../../../../../../../../components/confirm-dialog/ConfirmDialog";
import { DynamicComponents } from "../../../../../../../../components/dynamic/DynamicComponents";
import { FormAccess } from "../../../../../../../../components/form/FormAccess";
import { ViewHeader } from "../../../../../../../../components/view-header/ViewHeader";
import { useRealm } from "../../../../../../../../context/realm-context/realm-context";
import { useServerInfo } from "../../../../../../../../context/server-info/server-info-provider";
import { convertFormValuesToObject, convertToFormValues } from "../../../../../../../../util";
import { useParams } from "../../../../../../../../utils/use-params";
import { toClientScope } from "../../../../../../../../lib/client-scopes";
import { MapperParams, MapperRoute } from "../../../../../../../../lib/client-scopes";

const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
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
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

function MappingDetails() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const { id, mapperId, viewMode } = useParams<MapperParams>();
  const form = useForm();
  const { setValue, handleSubmit } = form;
  const [mapping, setMapping] = useState<ProtocolMapperTypeRepresentation>();
  const [config, setConfig] = useState<{
    protocol?: string;
    protocolMapper?: string;
  }>();

  const navigate = useNavigate();
  const { realm } = useRealm();
  const serverInfo = useServerInfo();
  const isUpdating = viewMode === "edit";

  const isOnClientScope = !!useMatch(MapperRoute.path);
  const toDetails = () =>
    isOnClientScope
      ? toClientScope({ realm, id, tab: "mappers" })
      : toDedicatedScope({ realm, clientId: id, tab: "mappers" });

  useFetch(
    async () => {
      let data: ProtocolMapperRepresentation | undefined;
      if (isUpdating) {
        if (isOnClientScope) {
          data = await adminClient.clientScopes.findProtocolMapper({
            id,
            mapperId,
          });
        } else {
          data = await adminClient.clients.findProtocolMapperById({
            id,
            mapperId,
          });
        }
        if (!data) {
          throw new Error(t("notFound"));
        }

        const mapperTypes = serverInfo.protocolMapperTypes![data!.protocol!];
        const mapping = mapperTypes.find(
          (type) => type.id === data!.protocolMapper,
        );

        return {
          config: {
            protocol: data.protocol,
            protocolMapper: data.protocolMapper,
          },
          mapping,
          data,
        };
      } else {
        const model = isOnClientScope
          ? await adminClient.clientScopes.findOne({ id })
          : await adminClient.clients.findOne({ id });
        if (!model) {
          throw new Error(t("notFound"));
        }
        const protocolMappers =
          serverInfo.protocolMapperTypes![model.protocol!];
        const mapping = protocolMappers.find(
          (mapper) => mapper.id === mapperId,
        );
        if (!mapping) {
          throw new Error(t("notFound"));
        }
        return {
          mapping,
          config: {
            protocol: model.protocol,
            protocolMapper: mapperId,
          },
        };
      }
    },
    ({ config, mapping, data }) => {
      setConfig(config);
      setMapping(mapping);
      if (data) {
        convertToFormValues(data, setValue);
      }
    },
    [],
  );

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deleteMappingTitle",
    messageKey: "deleteMappingConfirm",
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        if (isOnClientScope) {
          await adminClient.clientScopes.delProtocolMapper({
            id,
            mapperId,
          });
        } else {
          await adminClient.clients.delProtocolMapper({
            id,
            mapperId,
          });
        }
        addAlert(t("mappingDeletedSuccess"), AlertVariant.success);
        navigate(toDetails());
      } catch (error) {
        addError("mappingDeletedError", error);
      }
    },
  });

  const save = async (formMapping: ProtocolMapperRepresentation) => {
    const key = isUpdating ? "Updated" : "Created";
    try {
      const mapping = { ...config, ...convertFormValuesToObject(formMapping) };
      if (isUpdating) {
        if (isOnClientScope) {
          await adminClient.clientScopes.updateProtocolMapper(
            { id, mapperId },
            { id: mapperId, ...mapping },
          );
        } else {
          await adminClient.clients.updateProtocolMapper(
            { id, mapperId },
            { id: mapperId, ...mapping },
          );
        }
      } else {
        if (isOnClientScope) {
          await adminClient.clientScopes.addProtocolMapper({ id }, mapping);
        } else {
          await adminClient.clients.addProtocolMapper({ id }, mapping);
        }
      }
      addAlert(t(`mapping${key}Success`), AlertVariant.success);
      if (!isUpdating) {
        navigate(toDetails());
      }
    } catch (error) {
      addError(`mapping${key}Error`, error);
    }
  };

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={isUpdating ? mapping?.name! : t("addMapper")}
        subKey={isUpdating ? mapperId : "addMapperExplain"}
        dropdownItems={
          isUpdating
            ? [
                <DropdownItem
                  key="delete"
                  value="delete"
                  onClick={toggleDeleteDialog}
                >
                  {t("delete")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
      <PageSection variant="light">
        <FormProvider {...form}>
          <FormAccess
            isHorizontal
            onSubmit={handleSubmit(save)}
            role="manage-clients"
          >
            <FormGroup label={t("mapperType")} fieldId="mapperType">
              <TextInput
                type="text"
                id="mapperType"
                name="mapperType"
                readOnlyVariant="default"
                value={mapping?.name}
              />
            </FormGroup>
            <TextControl
              name="name"
              label={t("name")}
              labelIcon={t("mapperNameHelp")}
              readOnlyVariant={isUpdating ? "default" : undefined}
              rules={{ required: t("required") }}
            />
            <DynamicComponents
              properties={mapping?.properties || []}
              isNew={!isUpdating}
              stringify
            />
            <ActionGroup>
              <Button variant="primary" type="submit" data-testid="save">
                {t("save")}
              </Button>
              <Button
                data-testid="cancel"
                variant="link"
                component={(props) => <Link {...props} to={toDetails()} />}
              >
                {t("cancel")}
              </Button>
            </ActionGroup>
          </FormAccess>
        </FormProvider>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/clients/$id/clientScopes/dedicated/mappers/$mapperId/$viewMode")({
  component: MappingDetails,
})
