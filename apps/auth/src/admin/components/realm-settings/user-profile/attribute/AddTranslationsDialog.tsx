/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/attribute/AddTranslationsDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useFetch } from "../../../../../shared/keycloak-ui-shared";
import { ListEmptyState } from "@metronome/ui/components/list-empty-state";
import { PaginatingTableToolbar } from "@metronome/ui/components/table-toolbar";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react"
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useAdminClient } from "../../../../admin-client";
import { useRealm } from "../../../../context/realm-context/realm-context";
import { useWhoAmI } from "../../../../context/whoami/who-am-i";
import { beerify, localeToDisplayName } from "../../../../util";
import useLocale from "../../../../utils/use-locale";
import { Translation, TranslationForm } from "./TranslatableField";


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
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
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
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const Modal = ({ isOpen, onClose, title, description, variant, actions, header, footer, children, ...props }: any) => (
  <UIDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
    <UIDialogContent {...props}>
      {(title || header) ? (
        <UIDialogHeader>
          {title ? <UIDialogTitle>{title}</UIDialogTitle> : null}
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          {header}
        </UIDialogHeader>
      ) : null}
      {children}
      {(actions || footer) ? (
        <UIDialogFooter>
          {actions}
          {footer}
        </UIDialogFooter>
      ) : null}
    </UIDialogContent>
  </UIDialog>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;

type AddTranslationsDialogProps = {
  orgKey: string;
  translationKey: string;
  fieldName: string;
  toggleDialog: () => void;
  predefinedAttributes?: string[];
};

export const AddTranslationsDialog = ({
  orgKey,
  translationKey,
  fieldName,
  toggleDialog,
  predefinedAttributes,
}: AddTranslationsDialogProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const { realm: realmName, realmRepresentation: realm } = useRealm();
  const combinedLocales = useLocale();
  const { whoAmI } = useWhoAmI();
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [filter, setFilter] = useState("");
  const [translations, setTranslations] = useState<TranslationForm[]>([]);
  const prefix = `translation.${beerify(translationKey)}`;

  const {
    register,
    setValue,
    getValues,
    formState: { isValid },
  } = useFormContext();

  const setupForm = (translation: Translation) => {
    translation[translationKey].forEach((translation, rowIndex) => {
      const valueKey = `${prefix}.${rowIndex}.value`;
      setValue(`${prefix}.${rowIndex}.locale`, translation.locale || "");
      setValue(
        valueKey,
        getValues(valueKey) ||
          translation.value ||
          (t(orgKey) !== orgKey ? t(orgKey) : ""),
      );
    });
  };

  useFetch(
    async () => {
      const selectedLocales = combinedLocales
        .filter((l) =>
          localeToDisplayName(l, whoAmI.locale)
            ?.toLocaleLowerCase(realm?.defaultLocale)
            ?.includes(filter.toLocaleLowerCase(realm?.defaultLocale)),
        )
        .slice(first, first + max + 1);

      const results = await Promise.all(
        selectedLocales.map((selectedLocale) =>
          adminClient.realms.getRealmLocalizationTexts({
            realm: realmName,
            selectedLocale,
          }),
        ),
      );

      return results.map((result, index) => ({
        locale: selectedLocales[index],
        value: result[translationKey],
      }));
    },
    (fetchedData) => {
      setTranslations(fetchedData);
      setupForm({ [translationKey]: fetchedData });
    },
    [combinedLocales, first, max, filter],
  );

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t("addTranslationsModalTitle")}
      isOpen
      onClose={toggleDialog}
      actions={[
        <Button
          key="ok"
          data-testid="okTranslationBtn"
          variant="primary"
          form="add-translation"
          isDisabled={!isValid}
          onClick={toggleDialog}
        >
          {t("addTranslationDialogOkBtn")}
        </Button>,
        <Button
          key="cancel"
          data-testid="cancelTranslationBtn"
          variant="link"
          onClick={() => {
            setupForm({ [translationKey]: translations });
            toggleDialog();
          }}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <Flex
        direction={{ default: "column" }}
        spaceItems={{ default: "spaceItemsNone" }}
      >
        <FlexItem>
          <Trans
            i18nKey="addTranslationsModalTitle"
            values={{ fieldName: t(fieldName) }}
          >
            You are able to translate the fieldName based on your locale or
            <strong>location</strong>
          </Trans>
        </FlexItem>
        <FlexItem>
          <Form id="add-translation" data-testid="addTranslationForm">
            <FormGroup label={t("translationKey")} fieldId="translationKey">
              <TextInput
                id="translationKey"
                label={t("translationKey")}
                data-testid="translation-key"
                isDisabled
                value={
                  predefinedAttributes?.includes(orgKey)
                    ? `\${${orgKey}}`
                    : `\${${translationKey}}`
                }
              />
            </FormGroup>
            <FlexItem>
              <TextContent>
                <Text
                  className="pf-v5-u-font-size-sm pf-v5-u-font-weight-bold"
                  component={TextVariants.p}
                >
                  {t("translationsTableHeading")}
                </Text>
              </TextContent>
              <PaginatingTableToolbar
                count={translations.length}
                first={first}
                max={max}
                onNextClick={setFirst}
                onPreviousClick={setFirst}
                onPerPageSelect={(first, max) => {
                  setFirst(first);
                  setMax(max);
                }}
                inputGroupName={"search"}
                inputGroupOnEnter={(search) => {
                  setFilter(search);
                  setFirst(0);
                  setMax(10);
                }}
                inputGroupPlaceholder={t("searchForLanguage")}
              >
                {translations.length === 0 && filter && (
                  <ListEmptyState
                    hasIcon
                    icon={SearchIcon}
                    isSearchVariant
                    message={t("noSearchResults")}
                    instructions={t("noLanguagesSearchResultsInstructions")}
                  />
                )}
                {translations.length !== 0 && (
                  <Table
                    aria-label={t("addTranslationsDialogRowsTable")}
                    data-testid="add-translations-dialog-rows-table"
                  >
                    <Thead>
                      <Tr>
                        <Th className="pf-v5-u-py-lg">
                          {t("supportedLanguagesTableColumnName")}
                        </Th>
                        <Th className="pf-v5-u-py-lg">
                          {t("translationTableColumnName")}
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {translations.slice(0, max).map((translation, index) => (
                        <Tr key={index}>
                          <Td dataLabel={t("supportedLanguage")}>
                            {localeToDisplayName(
                              translation.locale,
                              whoAmI.locale,
                            )}
                            {translation.locale === realm?.defaultLocale && (
                              <Label className="pf-v5-u-ml-xs" color="blue">
                                {t("defaultLanguage")}
                              </Label>
                            )}
                          </Td>
                          <Td>
                            <TextInput
                              id={`${prefix}.${index}.value`}
                              data-testid={`translation-value-${index}`}
                              {...register(`${prefix}.${index}.value`, {
                                required: {
                                  value:
                                    translation.locale === realm?.defaultLocale,
                                  message: t("required"),
                                },
                              })}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </PaginatingTableToolbar>
            </FlexItem>
          </Form>
        </FlexItem>
      </Flex>
    </Modal>
  );
};
