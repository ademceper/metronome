/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/AddMapper.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type IdentityProviderRepresentation from "libs/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import type IdentityProviderMapperRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderMapperRepresentation";
import type { IdentityProviderMapperTypeRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/identityProviderMapperTypeRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { useAlerts, useFetch } from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { DynamicComponents } from "../../components/dynamic/DynamicComponents";
import { FormAccess } from "../../components/form/FormAccess";
import type { AttributeForm } from "../../components/key-value-form/AttributeForm";
import { KeycloakSpinner } from "../../../shared/keycloak-ui-shared";
import { ViewHeader } from "../../components/view-header/ViewHeader";
import { useRealm } from "../../context/realm-context/RealmContext";
import { convertFormValuesToObject, convertToFormValues } from "../../util";
import useLocaleSort, { mapByKey } from "../../utils/useLocaleSort";
import { useParams } from "../../utils/useParams";
import {
  IdentityProviderEditMapperParams,
  toIdentityProviderEditMapper,
} from "../../lib/identity-providers";
import { toIdentityProvider } from "../../lib/identity-providers";
import { AddMapperForm } from "./AddMapperForm";
import { GroupResourceContext } from "../../context/group-resource/GroupResourceContext";


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
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export type IdPMapperRepresentationWithAttributes =
  IdentityProviderMapperRepresentation & AttributeForm;

export type Role = RoleRepresentation & {
  clientId?: string;
};

export default function AddMapper() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();

  const form = useForm<IdPMapperRepresentationWithAttributes>();
  const { handleSubmit } = form;
  const { addAlert, addError } = useAlerts();
  const navigate = useNavigate();
  const localeSort = useLocaleSort();

  const { realm } = useRealm();

  const { id, providerId, alias } =
    useParams<IdentityProviderEditMapperParams>();

  const [mapperTypes, setMapperTypes] =
    useState<IdentityProviderMapperTypeRepresentation[]>();

  const [currentMapper, setCurrentMapper] =
    useState<IdentityProviderMapperTypeRepresentation>();

  const [idp, setIdp] = useState<IdentityProviderRepresentation>();

  const save = async (idpMapper: IdentityProviderMapperRepresentation) => {
    const mapper = convertFormValuesToObject(idpMapper);

    const identityProviderMapper = {
      ...mapper,
      config: {
        ...mapper.config,
      },
      identityProviderAlias: alias!,
    };

    if (id) {
      try {
        await adminClient.identityProviders.updateMapper(
          {
            id: id!,
            alias: alias!,
          },
          { ...identityProviderMapper, id },
        );
        addAlert(t("mapperSaveSuccess"), AlertVariant.success);
      } catch (error) {
        addError("mapperSaveError", error);
      }
    } else {
      try {
        const createdMapper = await adminClient.identityProviders.createMapper({
          identityProviderMapper,
          alias: alias!,
        });

        addAlert(t("mapperCreateSuccess"), AlertVariant.success);
        navigate(
          toIdentityProviderEditMapper({
            realm,
            alias,
            providerId: providerId,
            id: createdMapper.id,
          }),
        );
      } catch (error) {
        addError("mapperCreateError", error);
      }
    }
  };

  const [toggleDeleteMapperDialog, DeleteMapperConfirm] = useConfirmDialog({
    titleKey: "deleteProviderMapper",
    messageKey: t("deleteMapperConfirm", {
      mapper: currentMapper?.name,
    }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.identityProviders.delMapper({
          alias: alias,
          id: id!,
        });
        addAlert(t("deleteMapperSuccess"), AlertVariant.success);
        navigate(
          toIdentityProvider({ providerId, alias, tab: "mappers", realm }),
        );
      } catch (error) {
        addError("deleteErrorIdentityProvider", error);
      }
    },
  });

  useFetch(
    () =>
      Promise.all([
        id ? adminClient.identityProviders.findOneMapper({ alias, id }) : null,
        adminClient.identityProviders.findMapperTypes({ alias }),
        adminClient.identityProviders.findOne({ alias }),
      ]),
    ([mapper, mapperTypes, idp]) => {
      const mappers = localeSort(Object.values(mapperTypes), mapByKey("name"));
      if (mapper) {
        setCurrentMapper(
          mappers.find(({ id }) => id === mapper.identityProviderMapper),
        );
        setupForm(mapper);
      } else {
        setCurrentMapper(mappers[0]);
      }

      setMapperTypes(mappers);
      setIdp(idp);
    },
    [id],
  );

  const setupForm = (mapper: IdentityProviderMapperRepresentation) => {
    convertToFormValues(mapper, form.setValue);
  };

  if (!mapperTypes || !currentMapper) {
    return <KeycloakSpinner />;
  }

  return (
    <PageSection variant="light">
      <DeleteMapperConfirm />
      <ViewHeader
        className="kc-add-mapper-title"
        titleKey={
          id
            ? t("editIdPMapper", {
                providerId:
                  providerId[0].toUpperCase() + providerId.substring(1),
              })
            : t("addIdPMapper", {
                providerId:
                  providerId[0].toUpperCase() + providerId.substring(1),
              })
        }
        dropdownItems={
          id
            ? [
                <DropdownItem key="delete" onClick={toggleDeleteMapperDialog}>
                  {t("delete")}
                </DropdownItem>,
              ]
            : undefined
        }
        divider
      />
      <FormAccess
        role="manage-identity-providers"
        isHorizontal
        onSubmit={handleSubmit(save)}
        className="pf-v5-u-mt-lg"
      >
        <FormProvider {...form}>
          {id && (
            <>
              <FormGroup label={t("id")} fieldId="id">
                <TextInput name="id" readOnly value={id} />
              </FormGroup>
              <FormGroup label={t("name")} fieldId="name">
                <TextInput
                  name="name"
                  readOnly
                  value={form.getValues("name")}
                />
              </FormGroup>
            </>
          )}
          {currentMapper.properties && (
            <>
              <AddMapperForm
                form={form}
                id={id}
                mapperTypes={mapperTypes}
                updateMapperType={setCurrentMapper}
                mapperType={currentMapper}
              />
              <GroupResourceContext
                value={
                  idp?.organizationId
                    ? adminClient.organizations.groups(idp?.organizationId)
                    : adminClient.groups
                }
              >
                <DynamicComponents properties={currentMapper.properties!} />
              </GroupResourceContext>
            </>
          )}
        </FormProvider>
        <ActionGroup>
          <Button
            data-testid="new-mapper-save-button"
            variant="primary"
            type="submit"
          >
            {t("save")}
          </Button>
          <Button
            data-testid="new-mapper-cancel-button"
            variant="link"
            component={(props) => (
              <Link
                {...props}
                to={toIdentityProvider({
                  realm,
                  providerId,
                  alias: alias!,
                  tab: "mappers",
                })}
              />
            )}
          >
            {t("cancel")}
          </Button>
        </ActionGroup>
      </FormAccess>
    </PageSection>
  );
}
