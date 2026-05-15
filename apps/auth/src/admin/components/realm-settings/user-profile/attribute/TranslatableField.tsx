/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/attribute/TranslatableField.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { FormErrorText } from "../../../../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { Globe as GlobeRouteIcon } from "@phosphor-icons/react"
import { TFunction } from "i18next";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useRealm } from "../../../../context/realm-context/RealmContext";
import { beerify, debeerify } from "../../../../util";
import useToggle from "../../../../utils/useToggle";
import { AddTranslationsDialog } from "./AddTranslationsDialog";


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
const FormHelperText = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-xs", className)} {...props}>{children}</div>
);
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

export type TranslationForm = {
  locale: string;
  value: string;
};

export type Translation = Record<string, TranslationForm[]>;

export type Translations = {
  translation: Translation;
};

type SaveTranslationsProps = {
  adminClient: KeycloakAdminClient;
  realmName: string;
  translationsData: Translations;
};

export const saveTranslations = async ({
  adminClient,
  realmName,
  translationsData,
}: SaveTranslationsProps) => {
  await Promise.all(
    Object.entries(translationsData.translation)
      .map(([key, translation]) =>
        translation
          .filter((translation) => translation.value.trim() !== "")
          .map((translation) =>
            adminClient.realms.addLocalization(
              {
                realm: realmName,
                selectedLocale: translation.locale,
                key: debeerify(key),
              },
              translation.value,
            ),
          ),
      )
      .flat(),
  );
};

type TranslatableFieldProps = {
  attributeName: string;
  prefix: string;
  fieldName: string;
  predefinedAttributes?: string[];
};

function hasTranslation(value: string, t: TFunction) {
  return t(value) === value && value !== "";
}

export const TranslatableField = ({
  attributeName,
  prefix,
  fieldName,
  predefinedAttributes,
}: TranslatableFieldProps) => {
  const { t } = useTranslation();
  const { realmRepresentation: realm } = useRealm();
  const { register, control, getFieldState, setValue } = useFormContext();
  const [open, toggle] = useToggle();

  const value = useWatch({ control, name: attributeName });

  const key = `${prefix}.${value}`;
  const translationPrefix = `translation.${beerify(key)}`;
  const requiredTranslationName = `${translationPrefix}.0.value`;

  useEffect(() => {
    if (predefinedAttributes?.includes(value)) {
      return;
    }
    if (realm?.internationalizationEnabled && value) {
      setValue(fieldName, `\${${prefix}.${value}}`);
    }
  }, [value]);

  function isTranslationRequired(
    value: string,
    t: TFunction,
    realm?: RealmRepresentation,
  ) {
    return (
      realm?.internationalizationEnabled && open && hasTranslation(value, t)
    );
  }

  return (
    <>
      {isTranslationRequired(value, t, realm) && (
        <input
          type="hidden"
          data-testid="requiredTranslationName"
          {...register(requiredTranslationName, { required: t("required") })}
        />
      )}
      {open && (
        <AddTranslationsDialog
          orgKey={value}
          translationKey={`${prefix}.${value}`}
          fieldName={fieldName}
          predefinedAttributes={predefinedAttributes}
          toggleDialog={toggle}
        />
      )}
      <InputGroup>
        <InputGroupItem isFill>
          <TextInput
            id={`kc-attribute-${fieldName}`}
            data-testid={`attributes-${fieldName}`}
            isDisabled={realm?.internationalizationEnabled}
            {...register(fieldName)}
          />
        </InputGroupItem>
        {realm?.internationalizationEnabled && (
          <InputGroupItem>
            <Button
              variant="link"
              className="pf-m-plain"
              data-testid={`addAttribute${fieldName}TranslationBtn`}
              aria-label={t("addAttributeTranslation", { fieldName })}
              onClick={toggle}
              icon={<GlobeRouteIcon />}
            />
          </InputGroupItem>
        )}
      </InputGroup>
      {realm?.internationalizationEnabled && (
        <FormHelperText>
          <Alert
            variant="info"
            isInline
            isPlain
            title={
              <Trans
                i18nKey="addTranslationsModalSubTitle"
                values={{ fieldName: t(fieldName) }}
              >
                You are able to translate the fieldName based on your locale or
                <strong>location</strong>
              </Trans>
            }
          />
          {getFieldState(requiredTranslationName).error && (
            <FormErrorText message={t("required")} />
          )}
        </FormHelperText>
      )}
    </>
  );
};
