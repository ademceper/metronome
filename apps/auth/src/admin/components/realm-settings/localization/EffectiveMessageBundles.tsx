/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/localization/EffectiveMessageBundles.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import {
  KeycloakSelect,
  SelectVariant,
} from "../../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { cn } from "@metronome/ui/lib/utils";
import { pickBy } from "lodash-es";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import DropdownPanel from "../../dropdown-panel/DropdownPanel";
import { ListEmptyState } from "../../../../shared/keycloak-ui-shared";
import { KeycloakDataTable } from "../../../../shared/keycloak-ui-shared";
import { useRealm } from "../../../context/realm-context/RealmContext";
import { useServerInfo } from "../../../context/server-info/ServerInfoProvider";
import { useWhoAmI } from "../../../context/whoami/WhoAmI";
import { DEFAULT_LOCALE } from "../../../i18n/constants";
import { localeToDisplayName } from "../../../util";
import useLocaleSort, { mapByKey } from "../../../utils/useLocaleSort";
import { SelectOption } from "../../../../shared/pf-compat"


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
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
);
const Divider = (props: any) => <UISeparator {...props} />;
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

type EffectiveMessageBundlesProps = {
  defaultSupportedLocales: string[];
  defaultLocales: string[];
};

type EffectiveMessageBundlesSearchForm = {
  theme: string;
  themeType: string;
  locale: string;
  hasWords: string[];
};

const defaultValues: EffectiveMessageBundlesSearchForm = {
  theme: "",
  themeType: "",
  locale: "",
  hasWords: [],
};

export const EffectiveMessageBundles = ({
  defaultSupportedLocales,
  defaultLocales,
}: EffectiveMessageBundlesProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { realm } = useRealm();
  const serverInfo = useServerInfo();
  const { whoAmI } = useWhoAmI();
  const localeSort = useLocaleSort();
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectThemesOpen, setSelectThemesOpen] = useState(false);
  const [selectThemeTypeOpen, setSelectThemeTypeOpen] = useState(false);
  const [selectLanguageOpen, setSelectLanguageOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    Partial<EffectiveMessageBundlesSearchForm>
  >({});
  const [key, setKey] = useState(0);
  const themes = serverInfo.themes;

  const themeTypes = useMemo(() => {
    if (!themes) {
      return [];
    }

    return localeSort(Object.keys(themes), (key) => key);
  }, [themes]);

  const themeNames = useMemo(() => {
    if (!themes) {
      return [];
    }

    return localeSort(
      Object.values(themes as Record<string, { name: string }[]>)
        .flatMap((theme) => theme.map((item) => item.name))
        .filter((value, index, self) => self.indexOf(value) === index),
      (name) => name,
    );
  }, [themes]);

  const combinedLocales = useMemo(() => {
    return Array.from(new Set([...defaultLocales, ...defaultSupportedLocales]));
  }, [defaultLocales, defaultSupportedLocales]);

  const filterLabels: Record<keyof EffectiveMessageBundlesSearchForm, string> =
    {
      theme: t("theme"),
      themeType: t("themeType"),
      locale: t("language"),
      hasWords: t("hasWords"),
    };

  const {
    getValues,
    reset,
    formState: { isDirty, isValid },
    control,
  } = useForm<EffectiveMessageBundlesSearchForm>({
    mode: "onChange",
    defaultValues,
  });

  const loader = async () => {
    try {
      const filter = getValues();

      const requiredKeys = ["theme", "themeType", "locale"];
      const shouldReturnEmpty = requiredKeys.some(
        (key) => !filter[key as keyof EffectiveMessageBundlesSearchForm],
      );

      if (shouldReturnEmpty) {
        return [];
      }

      const messages = await adminClient.serverInfo.findEffectiveMessageBundles(
        {
          realm,
          ...filter,
          locale: filter.locale || DEFAULT_LOCALE,
          source: true,
        },
      );

      const filteredMessages =
        filter.hasWords.length > 0
          ? messages.filter((m) =>
              filter.hasWords.some(
                (f) => m.value.includes(f) || m.key.includes(f),
              ),
            )
          : messages;

      const sortedMessages = localeSort([...filteredMessages], mapByKey("key"));

      return sortedMessages;
    } catch {
      return [];
    }
  };

  function submitSearch() {
    setSearchDropdownOpen(false);
    commitFilters();
  }

  function resetSearch() {
    reset();
    commitFilters();
  }

  function removeFilter(key: keyof EffectiveMessageBundlesSearchForm) {
    const formValues: EffectiveMessageBundlesSearchForm = { ...getValues() };
    delete formValues[key];

    reset({ ...defaultValues, ...formValues });
    commitFilters();
  }

  function removeFilterValue(
    key: keyof EffectiveMessageBundlesSearchForm,
    valueToRemove: string,
  ) {
    const formValues = getValues();
    const fieldValue = formValues[key];
    const newFieldValue = Array.isArray(fieldValue)
      ? fieldValue.filter((val) => val !== valueToRemove)
      : fieldValue;

    reset({ ...formValues, [key]: newFieldValue });
    commitFilters();
  }

  function commitFilters() {
    const newFilters: Partial<EffectiveMessageBundlesSearchForm> = pickBy(
      getValues(),
      (value) => value !== "" || (Array.isArray(value) && value.length > 0),
    );

    setActiveFilters(newFilters);
    setKey(key + 1);
  }

  const effectiveMessageBunldesSearchFormDisplay = () => {
    return (
      <Flex
        direction={{ default: "column" }}
        spaceItems={{ default: "spaceItemsNone" }}
      >
        <FlexItem>
          <TextContent>
            <Text
              className="pf-v5-u-mb-md pf-v5-u-mt-0 pf-v5-u-mr-md"
              component={TextVariants.p}
            >
              {t("effectiveMessageBundlesDescription")}
            </Text>
          </TextContent>
        </FlexItem>
        <FlexItem>
          <DropdownPanel
            buttonText={t("searchForEffectiveMessageBundles")}
            setSearchDropdownOpen={setSearchDropdownOpen}
            searchDropdownOpen={searchDropdownOpen}
            marginRight="2.5rem"
            width="15vw"
          >
            <Form
              isHorizontal
              className="pf-v5-u-w-25vw"
              data-testid="effectiveMessageBundlesSearchForm"
              onSubmit={(e) => e.preventDefault()}
            >
              <FormGroup label={t("theme")} fieldId="kc-theme" isRequired>
                <Controller
                  name="theme"
                  control={control}
                  defaultValue=""
                  rules={{
                    validate: (value) => (value || "").length > 0,
                  }}
                  render={({ field }) => (
                    <KeycloakSelect
                      data-testid="effective_message_bundles-theme-searchField"
                      chipGroupProps={{
                        numChips: 1,
                        expandedText: t("hide"),
                        collapsedText: t("showRemaining"),
                      }}
                      variant={SelectVariant.single}
                      typeAheadAriaLabel="Select"
                      onToggle={(val) => setSelectThemesOpen(val)}
                      selections={field.value}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue.toString());
                        setSelectThemesOpen(false);
                      }}
                      onClear={() => {
                        field.onChange("");
                      }}
                      isOpen={selectThemesOpen}
                      aria-label={t("selectTheme")}
                      chipGroupComponent={
                        <ChipGroup>
                          <Chip
                            key={field.value}
                            onClick={(theme) => {
                              theme.stopPropagation();
                              field.onChange("");
                            }}
                          >
                            {field.value}
                          </Chip>
                        </ChipGroup>
                      }
                    >
                      {[
                        <SelectOption
                          key="theme_placeholder"
                          label={t("selectTheme")}
                          isDisabled
                        >
                          {t("selectTheme")}
                        </SelectOption>,
                      ].concat(
                        themeNames.map((option) => (
                          <SelectOption key={option} value={option}>
                            {option}
                          </SelectOption>
                        )),
                      )}
                    </KeycloakSelect>
                  )}
                />
              </FormGroup>
              <FormGroup
                label={t("themeType")}
                fieldId="kc-themeType"
                isRequired
              >
                <Controller
                  name="themeType"
                  control={control}
                  defaultValue=""
                  rules={{
                    validate: (value) => (value || "").length > 0,
                  }}
                  render={({ field }) => (
                    <KeycloakSelect
                      data-testid="effective-message-bundles-feature-searchField"
                      chipGroupProps={{
                        numChips: 1,
                        expandedText: t("hide"),
                        collapsedText: t("showRemaining"),
                      }}
                      variant={SelectVariant.single}
                      typeAheadAriaLabel="Select"
                      onToggle={(val) => setSelectThemeTypeOpen(val)}
                      selections={field.value}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue.toString());
                        setSelectThemeTypeOpen(false);
                      }}
                      onClear={() => {
                        field.onChange("");
                      }}
                      isOpen={selectThemeTypeOpen}
                      aria-label={t("selectThemeType")}
                      chipGroupComponent={
                        <ChipGroup>
                          <Chip
                            key={field.value}
                            onClick={(themeType) => {
                              themeType.stopPropagation();
                              field.onChange("");
                            }}
                          >
                            {field.value}
                          </Chip>
                        </ChipGroup>
                      }
                    >
                      {[
                        <SelectOption
                          key="themeType_placeholder"
                          label={t("selectThemeType")}
                          isDisabled
                        >
                          {t("selectThemeType")}
                        </SelectOption>,
                      ].concat(
                        themeTypes.map((option) => (
                          <SelectOption key={option} value={option}>
                            {option}
                          </SelectOption>
                        )),
                      )}
                    </KeycloakSelect>
                  )}
                />
              </FormGroup>
              <FormGroup label={t("language")} fieldId="kc-language" isRequired>
                <Controller
                  name="locale"
                  control={control}
                  defaultValue=""
                  rules={{
                    validate: (value) => (value || "").length > 0,
                  }}
                  render={({ field }) => (
                    <KeycloakSelect
                      data-testid="effective-message-bundles-language-searchField"
                      chipGroupProps={{
                        numChips: 1,
                        expandedText: t("hide"),
                        collapsedText: t("showRemaining"),
                      }}
                      variant={SelectVariant.single}
                      typeAheadAriaLabel="Select"
                      onToggle={(val) => setSelectLanguageOpen(val)}
                      selections={field.value}
                      onSelect={(selectedValue) => {
                        field.onChange(selectedValue.toString());
                        setSelectLanguageOpen(false);
                      }}
                      onClear={() => {
                        field.onChange("");
                      }}
                      isOpen={selectLanguageOpen}
                      aria-label={t("selectLanguage")}
                      chipGroupComponent={
                        <ChipGroup>
                          {field.value ? (
                            <Chip
                              key={field.value}
                              onClick={(language) => {
                                language.stopPropagation();
                                field.onChange("");
                              }}
                            >
                              {localeToDisplayName(field.value, whoAmI.locale)}
                            </Chip>
                          ) : null}
                        </ChipGroup>
                      }
                    >
                      {[
                        <SelectOption
                          key="language_placeholder"
                          label={t("selectLanguage")}
                          isDisabled
                        >
                          {t("selectLanguage")}
                        </SelectOption>,
                      ].concat(
                        combinedLocales.map((option) => (
                          <SelectOption key={option} value={option}>
                            {localeToDisplayName(option, whoAmI.locale)}
                          </SelectOption>
                        )),
                      )}
                    </KeycloakSelect>
                  )}
                />
              </FormGroup>
              <FormGroup label={t("hasWords")} fieldId="kc-hasWords">
                <Controller
                  name="hasWords"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <TextInput
                        id="kc-hasWords"
                        data-testid="effective-message-bundles-hasWords-searchField"
                        value={field.value.join(" ")}
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement;
                          const input = target.value;

                          if (input.trim().length === 0) {
                            field.onChange([]);
                          } else {
                            const words = input
                              .split(" ")
                              .map((word) => word.trim());
                            field.onChange(words);
                          }
                        }}
                      />
                      <ChipGroup>
                        {field.value.map((word: string, index: number) => (
                          <Chip
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              const newWords = field.value.filter(
                                (_: string, i: number) => i !== index,
                              );
                              field.onChange(newWords);
                            }}
                          >
                            {word}
                          </Chip>
                        ))}
                      </ChipGroup>
                    </div>
                  )}
                />
              </FormGroup>
              <ActionGroup className="pf-v5-u-mt-sm">
                <Button
                  variant={"primary"}
                  onClick={() => {
                    setSearchPerformed(true);
                    submitSearch();
                  }}
                  data-testid="search-effective-message-bundles-btn"
                  isDisabled={!isValid}
                >
                  {t("search")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={resetSearch}
                  data-testid="reset-search-effective-message-bundles-btn"
                  isDisabled={!isDirty}
                >
                  {t("reset")}
                </Button>
              </ActionGroup>
            </Form>
          </DropdownPanel>
        </FlexItem>
        <FlexItem>
          {Object.entries(activeFilters).length > 0 && (
            <>
              {Object.entries(activeFilters).map((filter) => {
                const [key, value] = filter as [
                  keyof EffectiveMessageBundlesSearchForm,
                  string | string[],
                ];
                return (
                  <ChipGroup
                    className="pf-v5-u-mt-md pf-v5-u-mr-md"
                    key={key}
                    categoryName={filterLabels[key]}
                    isClosable
                    onClick={() => removeFilter(key)}
                  >
                    {typeof value === "string" ? (
                      <Chip isReadOnly>
                        {key === "locale"
                          ? localeToDisplayName(
                              value,
                              whoAmI.locale,
                            )?.toLowerCase()
                          : value}
                      </Chip>
                    ) : (
                      value.map((entry) => (
                        <Chip
                          key={entry}
                          onClick={() => removeFilterValue(key, entry)}
                        >
                          {entry}
                        </Chip>
                      ))
                    )}
                  </ChipGroup>
                );
              })}
            </>
          )}
        </FlexItem>
      </Flex>
    );
  };

  if (!searchPerformed) {
    return (
      <>
        <div className="pf-v5-u-py-lg pf-v5-u-pl-md">
          {effectiveMessageBunldesSearchFormDisplay()}
        </div>
        <Divider />
        <ListEmptyState
          message={t("emptyEffectiveMessageBundles")}
          instructions={t("emptyEffectiveMessageBundlesInstructions")}
          isSearchVariant
        />
      </>
    );
  }

  return (
    <KeycloakDataTable
      key={key}
      loader={loader}
      ariaLabelKey="effectiveMessageBundles"
      toolbarItem={effectiveMessageBunldesSearchFormDisplay()}
      columns={[
        {
          name: "key",
          displayKey: "key",
        },
        {
          name: "value",
          displayKey: "value",
        },
      ]}
      emptyState={
        <ListEmptyState
          message={t("noSearchResults")}
          instructions={t("noSearchResultsInstructions")}
        />
      }
      isSearching={Object.keys(activeFilters).length > 0}
    />
  );
};
