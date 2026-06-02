// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import type ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import { DirectionType } from "@keycloak/keycloak-admin-client/lib/resources/userStorageProvider";
import {
  HelpItem,
  KeycloakSelect,
  KeycloakSpinner,
  SelectVariant,
  TextControl,
  useAlerts,
  useFetch,
} from "../../../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../../admin-client";
import { useConfirmDialog } from "../../../../../../components/confirm-dialog/ConfirmDialog";
import {
  convertToName,
  DynamicComponents,
} from "../../../../../../components/dynamic/DynamicComponents";
import { FormAccess } from "../../../../../../components/form/FormAccess";
import { ViewHeader } from "../../../../../../components/view-header/ViewHeader";
import { useRealm } from "../../../../../../context/realm-context/realm-context";
import { convertFormValuesToObject, convertToFormValues } from "../../../../../../util";
import { useParams } from "../../../../../../utils/use-params";
import { toUserFederationLdap } from "../../../../../../lib/user-federation";
import { UserFederationLdapMapperParams } from "../../../../../../lib/user-federation";
import { SelectOption } from "../../../../../../../shared/pf-compat"


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

function LdapMapperDetails() {
  const { adminClient } = useAdminClient();

  const form = useForm<ComponentRepresentation>();
  const [mapping, setMapping] = useState<ComponentRepresentation>();
  const [components, setComponents] = useState<ComponentTypeRepresentation[]>();

  const { id, mapperId } = useParams<UserFederationLdapMapperParams>();
  const navigate = useNavigate();
  const { realm } = useRealm();
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const [isMapperDropdownOpen, setIsMapperDropdownOpen] = useState(false);
  const [mapperTypeFilter, setMapperTypeFilter] = useState("");
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  useFetch(
    async () => {
      const components = await adminClient.components.listSubComponents({
        id,
        type: "org.keycloak.storage.ldap.mappers.LDAPStorageMapper",
      });
      if (mapperId && mapperId !== "new") {
        const fetchedMapper = await adminClient.components.findOne({
          id: mapperId,
        });
        return { components, fetchedMapper };
      }
      return { components };
    },
    ({ components, fetchedMapper }) => {
      setMapping(fetchedMapper);
      setComponents(components);
      if (mapperId !== "new" && !fetchedMapper) throw new Error(t("notFound"));

      if (fetchedMapper) setupForm(fetchedMapper);
    },
    [],
  );

  const setupForm = (mapper: ComponentRepresentation) => {
    convertToFormValues(mapper, form.setValue);
  };

  const save = async (mapper: ComponentRepresentation) => {
    const component: ComponentRepresentation =
      convertFormValuesToObject(mapper);
    const map = {
      ...component,
      config: Object.entries(component.config || {}).reduce(
        (result, [key, value]) => {
          result[key] = Array.isArray(value) ? value : [value];
          return result;
        },
        {} as Record<string, string | string[]>,
      ),
    };

    try {
      if (mapperId === "new") {
        await adminClient.components.create(map);
        navigate(
          toUserFederationLdap({ realm, id: mapper.parentId!, tab: "mappers" }),
        );
      } else {
        await adminClient.components.update({ id: mapperId }, map);
      }
      setupForm(map as ComponentRepresentation);
      addAlert(
        t(
          mapperId === "new"
            ? "mappingCreatedSuccess"
            : "mappingUpdatedSuccess",
        ),
        AlertVariant.success,
      );
    } catch (error) {
      addError(
        mapperId === "new" ? "mappingCreatedError" : "mappingUpdatedError",
        error,
      );
    }
  };

  const sync = async (direction: DirectionType) => {
    try {
      const result = await adminClient.userStorageProvider.mappersSync({
        parentId: mapping?.parentId || "",
        id: mapperId,
        direction,
      });
      addAlert(
        t("syncLDAPGroupsSuccessful", {
          result: result.status,
        }),
      );
    } catch (error) {
      addError("syncLDAPGroupsError", error);
    }
    refresh();
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deleteMappingTitle",
    messageKey: "deleteMappingConfirm",
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.components.del({
          id: mapping!.id!,
        });
        addAlert(t("mappingDeletedSuccess"), AlertVariant.success);
        navigate(toUserFederationLdap({ id, realm, tab: "mappers" }));
      } catch (error) {
        addError("mappingDeletedError", error);
      }
    },
  });

  const mapperType = useWatch({
    control: form.control,
    name: "providerId",
  });

  const selectItems = () =>
    (components || [])
      .filter((c) => c.id.includes(mapperTypeFilter))
      .map((c) => (
        <SelectOption key={c.id} value={c.id}>
          {c.id}
        </SelectOption>
      ));

  if (!components) {
    return <KeycloakSpinner />;
  }

  const isNew = mapperId === "new";
  const mapper = components.find((c) => c.id === mapperType);

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        key={key}
        titleKey={mapping ? mapping.name! : t("createNewMapper")}
        dropdownItems={
          isNew
            ? undefined
            : [
                <DropdownItem key="delete" onClick={toggleDeleteDialog}>
                  {t("delete")}
                </DropdownItem>,
                ...(mapper?.metadata.fedToKeycloakSyncSupported
                  ? [
                      <DropdownItem
                        key="fedSync"
                        onClick={() => sync("fedToKeycloak")}
                      >
                        {t(mapper.metadata.fedToKeycloakSyncMessage)}
                      </DropdownItem>,
                    ]
                  : []),
                ...(mapper?.metadata.keycloakToFedSyncSupported
                  ? [
                      <DropdownItem
                        key="ldapSync"
                        onClick={async () => {
                          await sync("keycloakToFed");
                        }}
                      >
                        {t(mapper.metadata.keycloakToFedSyncMessage)}
                      </DropdownItem>,
                    ]
                  : []),
              ]
        }
      />
      <PageSection variant="light" isFilled>
        <FormProvider {...form}>
          <FormAccess
            role="manage-realm"
            isHorizontal
            onSubmit={form.handleSubmit(() => save(form.getValues()))}
          >
            {!isNew && <TextControl name="id" label={t("id")} isDisabled />}
            <TextControl
              name="name"
              label={t("name")}
              labelIcon={t("mapperNameHelp")}
              isDisabled={!isNew}
              rules={{ required: t("required") }}
            />
            <input
              type="hidden"
              defaultValue={isNew ? id : mapping ? mapping.parentId : ""}
              data-testid="ldap-mapper-parentId"
              {...form.register("parentId")}
            />
            <input
              type="hidden"
              defaultValue="org.keycloak.storage.ldap.mappers.LDAPStorageMapper"
              data-testid="ldap-mapper-provider-type"
              {...form.register("providerType")}
            />
            {!isNew ? (
              <TextControl
                name="providerId"
                label={t("mapperType")}
                labelIcon={
                  mapper?.helpText ? mapper.helpText : t("mapperTypeHelp")
                }
                rules={{ required: t("required") }}
                isDisabled={!isNew}
              />
            ) : (
              <FormGroup
                label={t("mapperType")}
                labelIcon={
                  <HelpItem
                    helpText={
                      mapper?.helpText ? mapper.helpText : t("mapperTypeHelp")
                    }
                    fieldLabelId="mapperType"
                  />
                }
                fieldId="kc-providerId"
                isRequired
              >
                <Controller
                  name="providerId"
                  defaultValue=""
                  control={form.control}
                  data-testid="ldap-mapper-type-select"
                  render={({ field }) => (
                    <KeycloakSelect
                      toggleId="kc-providerId"
                      typeAheadAriaLabel={t("mapperType")}
                      onToggle={setIsMapperDropdownOpen}
                      isOpen={isMapperDropdownOpen}
                      onFilter={(search) => {
                        setMapperTypeFilter(search);
                        return selectItems();
                      }}
                      onSelect={(value) => {
                        setupForm({
                          providerId: value as string,
                          ...Object.fromEntries(
                            components
                              .find((c) => c.id === value)
                              ?.properties.filter((m) => m.type === "List")
                              .map((m) => [
                                convertToName(m.name!),
                                m.options?.[0],
                              ]) || [],
                          ),
                        });
                      }}
                      selections={field.value}
                      variant={SelectVariant.typeahead}
                      aria-label={t("selectMapperType")}
                    >
                      {selectItems()}
                    </KeycloakSelect>
                  )}
                ></Controller>
              </FormGroup>
            )}

            {!!mapperType && (
              <DynamicComponents properties={mapper?.properties!} />
            )}
            <ActionGroup>
              <Button
                isDisabled={!form.formState.isDirty}
                variant="primary"
                type="submit"
                data-testid="ldap-mapper-save"
              >
                {t("save")}
              </Button>
              <Button
                variant="link"
                onClick={() =>
                  isNew
                    ? navigate(-1)
                    : navigate(
                        `/${realm}/user-federation/ldap/${
                          mapping!.parentId
                        }/mappers`,
                      )
                }
                data-testid="ldap-mapper-cancel"
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

export const Route = createFileRoute("/$realm/user-federation/ldap/$id/mappers/$mapperId")({
  component: LdapMapperDetails,
})
