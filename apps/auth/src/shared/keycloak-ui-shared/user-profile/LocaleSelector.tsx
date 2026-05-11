/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/LocaleSelector.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@metronome/ui/components/select";
import { Label } from "@metronome/ui/components/label";
import { cn } from "@metronome/ui/lib/utils";
import { useMemo } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { UserProfileFieldProps } from "./UserProfileFields";

const localeToDisplayName = (locale: string) => {
  try {
    return new Intl.DisplayNames([locale], { type: "language" }).of(locale);
  } catch {
    return locale;
  }
};

type LocaleSelectorProps = Omit<UserProfileFieldProps, "inputType"> & {
  supportedLocales: string[];
  currentLocale: string;
};

const SELECT_EMPTY = "__pf_empty__";
const toRadixValue = (v: any) =>
  v === "" || v == null ? SELECT_EMPTY : String(v);
const fromRadixValue = (v: any) => (v === SELECT_EMPTY ? "" : v);

export const LocaleSelector = ({
  t,
  form,
  supportedLocales,
  currentLocale,
}: LocaleSelectorProps) => {
  const locales = useMemo(
    () =>
      supportedLocales
        .map((locale) => ({
          key: locale,
          value: t(`locale_${locale}`, localeToDisplayName(locale) ?? locale),
        }))
        .sort((a, b) => a.value.localeCompare(b.value, currentLocale)),
    [supportedLocales, currentLocale, t],
  );

  if (!locales.length) {
    return null;
  }

  const fieldId = "attributes.locale";

  return (
    <FormProvider {...form}>
      <div className="space-y-1">
        <div className="relative">
          <Controller
            name="attributes.locale"
            control={form.control}
            defaultValue=""
            render={({ field }) => (
              <Select
                value={toRadixValue(field.value)}
                onValueChange={(v) => field.onChange(fromRadixValue(v))}
              >
                <SelectTrigger
                  id={fieldId}
                  data-testid="locale-select"
                  className={cn(
                    "peer h-12! w-full pt-5 pb-1 pl-4",
                    "focus-visible:ring-0 aria-invalid:ring-0",
                  )}
                >
                  <SelectValue placeholder=" " />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_EMPTY}>
                    {t("defaultLocale")}
                  </SelectItem>
                  {locales.map((l) => (
                    <SelectItem key={l.key} value={l.key}>
                      {l.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Label
            htmlFor={fieldId}
            className="pointer-events-none absolute top-1 left-4 z-10 text-muted-foreground text-xs"
          >
            {t("selectALocale")}
          </Label>
        </div>
      </div>
    </FormProvider>
  );
};
