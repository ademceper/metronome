// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import type {
  UserProfileAttribute,
  UserProfileConfig,
} from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import {
  ScrollForm,
  useAlerts,
  useFetch,
} from "../../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { flatten } from "flat";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../../../admin-client";
import { FixedButtonsGroup } from "../../../../../components/form/FixedButtonGroup";
import { ViewHeader } from "../../../../../components/view-header/ViewHeader";
import { convertToFormValues } from "../../../../../util";
import { useParams } from "../../../../../utils/use-params";
import { TranslationForm } from "../../../../../components/realm-settings/AddTranslationModal";
import type { AttributeParams } from "../../../../../lib/realm-settings";
import { toUserProfile } from "../../../../../lib/realm-settings";
import { UserProfileProvider } from "../../../../../components/realm-settings/user-profile/UserProfileContext";
import {
  saveTranslations,
  Translations,
} from "../../../../../components/realm-settings/user-profile/attribute/TranslatableField";
import { AttributeAnnotations } from "../../../../../components/realm-settings/user-profile/attribute/AttributeAnnotations";
import { AttributeGeneralSettings } from "../../../../../components/realm-settings/user-profile/attribute/AttributeGeneralSettings";
import { AttributePermission } from "../../../../../components/realm-settings/user-profile/attribute/AttributePermission";
import { AttributeValidations } from "../../../../../components/realm-settings/user-profile/attribute/AttributeValidations";

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
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

type IndexedAnnotations = {
  key: string;
  value?: Record<string, unknown>;
};

export type IndexedValidations = {
  key: string;
  value?: Record<string, unknown>;
};

type UserProfileAttributeFormFields = Omit<
  UserProfileAttribute,
  "validations" | "annotations"
> &
  Translations &
  Attribute &
  Permission & {
    validations: IndexedValidations[];
    annotations: IndexedAnnotations[];
    hasSelector: boolean;
    hasRequiredScopes: boolean;
    translations?: TranslationForm[];
  };

type Attribute = {
  roles: string[];
  scopes: string[];
  isRequired: boolean;
};

type Permission = {
  view: PermissionView[];
  edit: PermissionEdit[];
};

type PermissionView = [
  {
    adminView: boolean;
    userView: boolean;
  },
];

type PermissionEdit = [
  {
    adminEdit: boolean;
    userEdit: boolean;
  },
];

export const USERNAME_EMAIL = ["username", "email"];

const CreateAttributeFormContent = ({
  save,
}: {
  save: (profileConfig: UserProfileConfig) => void;
}) => {
  const { t } = useTranslation();
  const form = useFormContext();
  const { realm, attributeName } = useParams<AttributeParams>();
  const editMode = attributeName ? true : false;

  return (
    <UserProfileProvider>
      <ScrollForm
        label={t("jumpToSection")}
        sections={[
          { title: t("generalSettings"), panel: <AttributeGeneralSettings /> },
          { title: t("permission"), panel: <AttributePermission /> },
          { title: t("validations"), panel: <AttributeValidations /> },
          { title: t("annotations"), panel: <AttributeAnnotations /> },
        ]}
      />
      <Form onSubmit={form.handleSubmit(save)}>
        <FixedButtonsGroup name="attribute-settings">
          <Button
            variant="primary"
            type="submit"
            data-testid="attribute-create"
          >
            {editMode ? t("save") : t("create")}
          </Button>
          <Link
            to={toUserProfile({ realm, tab: "attributes" })}
            data-testid="attribute-cancel"
            className="kc-attributeCancel"
          >
            {t("cancel")}
          </Link>
        </FixedButtonsGroup>
      </Form>
    </UserProfileProvider>
  );
};

function NewAttributeSettings() {
  const { adminClient } = useAdminClient();
  const { realm: realmName, attributeName } = useParams<AttributeParams>();
  const form = useForm<UserProfileAttributeFormFields>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addAlert, addError } = useAlerts();
  const [config, setConfig] = useState<UserProfileConfig | null>(null);
  const editMode = attributeName ? true : false;

  useFetch(
    () => adminClient.users.getProfile(),
    (config) => {
      setConfig(config);
      const {
        annotations,
        validations,
        permissions,
        selector,
        required,
        multivalued,
        defaultValue,
        ...values
      } = config.attributes!.find(
        (attribute) => attribute.name === attributeName,
      ) || { permissions: { edit: ["admin"] } };
      convertToFormValues(
        {
          ...values,
          hasSelector: typeof selector !== "undefined",
          hasRequiredScopes: typeof required?.scopes !== "undefined",
        },
        form.setValue,
      );
      Object.entries(
        flatten<any, any>({ permissions, selector, required }, { safe: true }),
      ).map(([key, value]) => form.setValue(key as any, value));
      form.setValue(
        "annotations",
        Object.entries(annotations || {}).map(([key, value]) => ({
          key,
          value: value as Record<string, unknown>,
        })),
      );
      form.setValue(
        "validations",
        Object.entries(validations || {}).map(([key, value]) => ({
          key,
          value: value as Record<string, unknown>,
        })),
      );
      form.setValue("isRequired", required !== undefined);
      form.setValue("multivalued", multivalued === true);
      form.setValue("defaultValue", defaultValue);
    },
    [],
  );

  const save = async ({
    hasSelector,
    hasRequiredScopes,
    ...formFields
  }: UserProfileAttributeFormFields) => {
    if (!hasSelector) {
      delete formFields.selector;
    }

    if (!hasRequiredScopes) {
      delete formFields.required?.scopes;
    }

    const validations = formFields.validations.reduce(
      (prevValidations, currentValidations) => {
        prevValidations[currentValidations.key] =
          currentValidations.value || {};
        return prevValidations;
      },
      {} as Record<string, unknown>,
    );

    const annotations = formFields.annotations.reduce(
      (obj, item) => Object.assign(obj, { [item.key]: item.value }),
      {},
    );

    const patchAttributes = () =>
      (config?.attributes || []).map((attribute) => {
        if (attribute.name !== attributeName) {
          return attribute;
        }

        delete attribute.required;
        return Object.assign(
          {
            ...attribute,
            name: attributeName,
            displayName: formFields.displayName!,
            selector: formFields.selector,
            permissions: formFields.permissions!,
            multivalued: formFields.multivalued,
            annotations,
            validations,
          },
          formFields.defaultValue
            ? { defaultValue: formFields.defaultValue }
            : { defaultValue: null },
          formFields.isRequired ? { required: formFields.required } : undefined,
          formFields.group ? { group: formFields.group } : { group: null },
        );
      });

    const addAttribute = () =>
      (config?.attributes || []).concat([
        Object.assign(
          {
            name: formFields.name,
            displayName: formFields.displayName!,
            required: formFields.isRequired ? formFields.required : undefined,
            selector: formFields.selector,
            permissions: formFields.permissions!,
            multivalued: formFields.multivalued,
            annotations,
            validations,
          },
          formFields.defaultValue
            ? { defaultValue: formFields.defaultValue }
            : { defaultValue: null },
          formFields.isRequired ? { required: formFields.required } : undefined,
          formFields.group ? { group: formFields.group } : undefined,
        ),
      ] as UserProfileAttribute);

    try {
      const updatedAttributes = editMode ? patchAttributes() : addAttribute();

      await adminClient.users.updateProfile({
        ...config,
        attributes: updatedAttributes as UserProfileAttribute[],
        realm: realmName,
      });

      if (formFields.translation) {
        try {
          await saveTranslations({
            adminClient,
            realmName,
            translationsData: {
              translation: formFields.translation,
            },
          });
          await i18n.reloadResources();
        } catch (error) {
          addError(t("errorSavingTranslations"), error);
        }
      }
      navigate(toUserProfile({ realm: realmName, tab: "attributes" }));

      addAlert(t("createAttributeSuccess"), AlertVariant.success);
    } catch (error) {
      addError("createAttributeError", error);
    }
  };

  return (
    <FormProvider {...form}>
      <ViewHeader
        titleKey={editMode ? attributeName : t("createAttribute")}
        subKey={editMode ? "" : t("createAttributeSubTitle")}
      />
      <PageSection variant="light">
        <CreateAttributeFormContent save={() => form.handleSubmit(save)()} />
      </PageSection>
    </FormProvider>
  );
}

export const Route = createFileRoute("/$realm/realm-settings/user-profile/attributes/add-attribute")({
  component: NewAttributeSettings,
})
