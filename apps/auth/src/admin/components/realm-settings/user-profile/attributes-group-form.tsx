/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/AttributesGroupForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type { UserProfileGroup } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import {
  HelpItem,
  TextControl,
  useAlerts,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { FormAccess } from "../../form/form-access";
import { KeyValueInput } from "../../key-value-form/key-value-input";
import type { KeyValueType } from "../../key-value-form/key-value-convert";
import { ViewHeader } from "../../view-header/view-header";
import { useRealm } from "../../../context/realm-context/realm-context";
import type { EditAttributesGroupParams } from "../../../lib/realm-settings";
import { toUserProfile } from "../../../lib/realm-settings";
import { useUserProfile } from "./user-profile-context";
import { saveTranslations, Translations } from "./attribute/translatable-field";
import { TranslatableField } from "./attribute/translatable-field";


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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);

function parseAnnotations(input: Record<string, unknown>): KeyValueType[] {
  return Object.entries(input).reduce((p, [key, value]) => {
    if (typeof value === "string") {
      return [...p, { key, value }];
    } else {
      return [...p];
    }
  }, [] as KeyValueType[]);
}

function transformAnnotations(input: KeyValueType[]): Record<string, unknown> {
  return Object.fromEntries(
    input
      .filter((annotation) => annotation.key.length > 0)
      .map((annotation) => [annotation.key, annotation.value] as const),
  );
}

type FormFields = Required<Omit<UserProfileGroup, "annotations">> &
  Translations & {
    annotations: KeyValueType[];
  };

const defaultValues: FormFields = {
  annotations: [],
  displayDescription: "",
  displayHeader: "",
  name: "",
  translation: { key: [] },
};

export default function AttributesGroupForm() {
  const { adminClient } = useAdminClient();
  const { t, i18n } = useTranslation();
  const { realm: realmName, realmRepresentation: realm } = useRealm();
  const { config, save } = useUserProfile();
  const navigate = useNavigate();
  const params = useParams<EditAttributesGroupParams>();
  const form = useForm<FormFields>({ defaultValues });
  const { addError } = useAlerts();
  const editMode = params.name ? true : false;

  const matchingGroup = useMemo(
    () => config?.groups?.find(({ name }) => name === params.name),
    [config?.groups, params.name],
  );

  useEffect(() => {
    if (!matchingGroup) {
      return;
    }

    const annotations = matchingGroup.annotations
      ? parseAnnotations(matchingGroup.annotations)
      : [];

    form.reset({ ...defaultValues, ...matchingGroup, annotations });
  }, [matchingGroup, form]);

  const onSubmit: SubmitHandler<FormFields> = async (values) => {
    if (!config) {
      return;
    }

    const groups = [...(config.groups ?? [])];
    const updateAt = matchingGroup ? groups.indexOf(matchingGroup) : -1;
    const { translation, ...groupValues } = values;
    const updatedGroup: UserProfileGroup = {
      ...groupValues,
      annotations: transformAnnotations(values.annotations),
    };

    if (updateAt === -1) {
      groups.push(updatedGroup);
    } else {
      groups[updateAt] = updatedGroup;
    }

    const success = await save({ ...config, groups });

    if (success) {
      if (realm?.internationalizationEnabled) {
        try {
          await saveTranslations({
            adminClient,
            realmName,
            translationsData: { translation },
          });
          await i18n.reloadResources();
        } catch (error) {
          addError(t("errorSavingTranslations"), error);
        }
      }
      navigate(toUserProfile({ realm: realmName, tab: "attributes-group" }));
    }
  };

  return (
    <FormProvider {...form}>
      <ViewHeader
        titleKey={matchingGroup ? "editGroupText" : "createGroupText"}
        divider
      />
      <PageSection variant="light" onSubmit={form.handleSubmit(onSubmit)}>
        <FormAccess isHorizontal role="manage-realm">
          <TextControl
            name="name"
            label={t("nameField")}
            labelIcon={t("nameHintHelp")}
            isDisabled={!!matchingGroup || editMode}
            rules={{
              required: t("required"),
            }}
          />
          <FormGroup
            label={t("displayHeader")}
            labelIcon={
              <HelpItem
                helpText={t("displayHeaderHintHelp")}
                fieldLabelId="displayHeader"
              />
            }
            fieldId="kc-attributes-group-display-header"
          >
            <TranslatableField
              fieldName="displayHeader"
              attributeName="name"
              prefix="profile.attribute-group"
            />
          </FormGroup>
          <FormGroup
            label={t("displayDescription")}
            labelIcon={
              <HelpItem
                helpText={t("displayDescriptionHintHelp")}
                fieldLabelId="displayDescription"
              />
            }
            fieldId="kc-attributes-group-display-description"
          >
            <TranslatableField
              fieldName="displayDescription"
              attributeName="name"
              prefix="profile.attribute-group-description"
            />
          </FormGroup>
          <TextContent>
            <Text component="h2">{t("annotationsText")}</Text>
          </TextContent>
          <FormGroup label={t("annotationsText")} fieldId="kc-annotations">
            <KeyValueInput label={t("annotationsText")} name="annotations" />
          </FormGroup>
          <ActionGroup>
            <Button variant="primary" type="submit" data-testid="saveGroupBtn">
              {t("save")}
            </Button>
            <Button
              variant="link"
              component={(props) => (
                <Link
                  {...props}
                  to={toUserProfile({
                    realm: realmName,
                    tab: "attributes-group",
                  })}
                />
              )}
            >
              {t("cancel")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </FormProvider>
  );
}
