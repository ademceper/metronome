// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import type ResourceRepresentation from "@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation";
import {
  HelpItem,
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../../../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../../admin-client";
import { DefaultSwitchControl } from "../../../../../../components/switch-control";
import { useConfirmDialog } from "../../../../../../components/confirm-dialog/confirm-dialog";
import { FormAccess } from "../../../../../../components/form/form-access";
import { KeyValueInput } from "../../../../../../components/key-value-form/key-value-input";
import type { KeyValueType } from "../../../../../../components/key-value-form/key-value-convert";
import { KeycloakSpinner } from "../../../../../../../shared/keycloak-ui-shared";
import { MultiLineInput } from "../../../../../../components/multi-line-input/multi-line-input";
import { ViewHeader } from "../../../../../../components/view-header/view-header";
import { useAccess } from "../../../../../../context/access/access";
import { convertFormValuesToObject, convertToFormValues } from "../../../../../../util";
import { useParams } from "../../../../../../utils/use-params";
import { toAuthorizationTab } from "../../../../../../lib/clients";
import { ResourceDetailsParams, toResourceDetails } from "../../../../../../lib/clients";
import { ScopePicker } from "../../../../../../components/clients/authorization/scope-picker";

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
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
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

type SubmittedResource = Omit<
  ResourceRepresentation,
  "attributes" | "scopes"
> & {
  attributes: KeyValueType[];
};

function ResourceDetails() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const [client, setClient] = useState<ClientRepresentation>();
  const [resource, setResource] = useState<ResourceRepresentation>();

  const [permissions, setPermission] = useState<PolicyRepresentation[]>();

  const { addAlert, addError } = useAlerts();
  const form = useForm<SubmittedResource>({
    mode: "onChange",
  });
  const { setValue, handleSubmit } = form;

  const { id, resourceId, realm } = useParams<ResourceDetailsParams>();
  const navigate = useNavigate();

  const setupForm = (resource: ResourceRepresentation = {}) => {
    convertToFormValues(resource, setValue);
  };

  const { hasAccess } = useAccess();

  const isDisabled = !hasAccess("manage-authorization");

  useFetch(
    () =>
      Promise.all([
        adminClient.clients.findOne({ id }),
        resourceId
          ? adminClient.clients.getResource({ id, resourceId })
          : Promise.resolve(undefined),
        resourceId
          ? adminClient.clients.listPermissionsByResource({ id, resourceId })
          : Promise.resolve(undefined),
      ]),
    ([client, resource, permissions]) => {
      if (!client) {
        throw new Error(t("notFound"));
      }
      setClient(client);
      setPermission(permissions);
      setResource(resource);
      setupForm(resource);
    },
    [],
  );

  const submit = async (submitted: SubmittedResource) => {
    const resource = convertFormValuesToObject<
      SubmittedResource,
      ResourceRepresentation
    >(submitted);

    try {
      if (resourceId) {
        await adminClient.clients.updateResource({ id, resourceId }, resource);
      } else {
        const result = await adminClient.clients.createResource(
          { id },
          resource,
        );
        setResource(resource);
        navigate(toResourceDetails({ realm, id, resourceId: result._id! }));
      }
      addAlert(
        t((resourceId ? "update" : "create") + "ResourceSuccess"),
        AlertVariant.success,
      );
    } catch (error) {
      addError("resourceSaveError", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deleteResource",
    children: (
      <>
        {t("deleteResourceConfirm")}
        {permissions?.length !== 0 && (
          <Alert
            variant="warning"
            isInline
            isPlain
            title={t("deleteResourceWarning")}
            className="pf-v5-u-pt-lg"
          >
            <p className="pf-v5-u-pt-xs">
              {permissions?.map((permission) => (
                <strong key={permission.id} className="pf-v5-u-pr-md">
                  {permission.name}
                </strong>
              ))}
            </p>
          </Alert>
        )}
      </>
    ),
    continueButtonLabel: "confirm",
    onConfirm: async () => {
      try {
        await adminClient.clients.delResource({
          id,
          resourceId: resourceId!,
        });
        addAlert(t("resourceDeletedSuccess"), AlertVariant.success);
        navigate(toAuthorizationTab({ realm, clientId: id, tab: "resources" }));
      } catch (error) {
        addError("resourceDeletedError", error);
      }
    },
  });

  if (!client) {
    return <KeycloakSpinner />;
  }

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={resourceId ? resource?.name! : "createResource"}
        dropdownItems={
          resourceId
            ? [
                <DropdownItem
                  key="delete"
                  data-testid="delete-resource"
                  isDisabled={isDisabled}
                  onClick={() => toggleDeleteDialog()}
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
            role="manage-authorization"
            className="keycloak__resource-details__form"
            onSubmit={handleSubmit(submit)}
          >
            <TextControl
              name={resourceId ? "owner.name" : ""}
              label={t("owner")}
              labelIcon={t("ownerHelp")}
              defaultValue={client.clientId}
              readOnly
            />
            <TextControl
              name={"name"}
              label={t("name")}
              labelIcon={t("resourceNameHelp")}
              rules={{ required: t("required") }}
            />
            <TextControl
              name="displayName"
              label={t("displayName")}
              labelIcon={t("displayNameHelp")}
              rules={{ required: t("required") }}
            />
            <TextControl
              name="type"
              label={t("type")}
              labelIcon={t("resourceDetailsTypeHelp")}
            />
            <FormGroup
              label={t("uris")}
              fieldId="uris"
              labelIcon={
                <HelpItem helpText={t("urisHelp")} fieldLabelId="uris" />
              }
            >
              <MultiLineInput
                name="uris"
                type="url"
                aria-label={t("uris")}
                addButtonLabel="addUri"
              />
            </FormGroup>
            <ScopePicker clientId={id} />
            <TextControl
              name="icon_uri"
              label={t("iconUri")}
              labelIcon={t("iconUriHelp")}
              type="url"
            />
            <DefaultSwitchControl
              name="ownerManagedAccess"
              label={t("ownerManagedAccess")}
              labelIcon={t("ownerManagedAccessHelp")}
            />
            <FormGroup
              hasNoPaddingTop
              label={t("resourceAttribute")}
              labelIcon={
                <HelpItem
                  helpText={t("resourceAttributeHelp")}
                  fieldLabelId="resourceAttribute"
                />
              }
              fieldId="resourceAttribute"
            >
              <KeyValueInput name="attributes" isDisabled={isDisabled} />
            </FormGroup>
            <ActionGroup>
              <div className="pf-v5-u-mt-md">
                <Button
                  variant={ButtonVariant.primary}
                  type="submit"
                  data-testid="save"
                >
                  {t("save")}
                </Button>

                <Button
                  variant="link"
                  data-testid="cancel"
                  component={(props) => (
                    <Link
                      {...props}
                      to={toAuthorizationTab({
                        realm,
                        clientId: id,
                        tab: "resources",
                      })}
                    ></Link>
                  )}
                >
                  {t("cancel")}
                </Button>
              </div>
            </ActionGroup>
          </FormAccess>
        </FormProvider>
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/clients/$id/authorization/resource/$resourceId")({
  component: ResourceDetails,
})
