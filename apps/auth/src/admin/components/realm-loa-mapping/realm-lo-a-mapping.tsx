/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/realm-loa-mapping/RealmLoAMapping.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { MinusCircle as MinusCircleIcon, PlusCircle as PlusCircleIcon } from "@phosphor-icons/react"
import { Fragment, PropsWithChildren } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";


const ActionList = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const ActionListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
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
const EmptyState = ({ variant, titleText, headingLevel, icon, children, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-3 py-10 text-center", (props as any).className)} {...props}>
    {icon ? <div className="text-muted-foreground">{React.createElement(icon)}</div> : null}
    {titleText ? <h3 className="font-medium text-lg">{titleText}</h3> : null}
    {children}
  </div>
);
const EmptyStateBody = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props}>{children}</div>
);
const EmptyStateFooter = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-2", className)} {...props}>{children}</div>
);
const Grid = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-2", className)} {...props}>{children}</div>
);
const GridItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const HelperText = ({ children, className, ...props }: any) => (
  <div className={cn("text-sm text-muted-foreground", className)} {...props}>{children}</div>
);
const HelperTextItem = ({ icon, variant, children, ...props }: any) => (
  <p className={cn("text-sm",
    variant === "error" ? "text-destructive" : variant === "warning" ? "text-amber-600" : "text-muted-foreground",
    (props as any).className)} {...props}>
    {icon}{children}
  </p>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

type RealmLoAMappingProps = PropsWithChildren & {
  name: string;
  label?: string;
  uri: boolean;
};

export type RealmLoAMappingType = { acr: string; uri?: string; loa: string };

export const RealmLoAMapping = ({
  name,
  label = "attributes",
  uri = false,
}: RealmLoAMappingProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const spanAcr = uri ? 4 : 5;
  const spanLoA = uri ? 2 : 5;

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const appendNew = () => append({ acr: "", uri: "", loa: "" });

  const getError = () => {
    return name.split(".").reduce((record: any, key) => record?.[key], errors);
  };

  return fields.length > 0 ? (
    <>
      <Grid hasGutter>
        <GridItem className="pf-v5-c-form__label" span={spanAcr}>
          <span className="pf-v5-c-form__label-text">{t("acr")}</span>
        </GridItem>
        {uri && (
          <GridItem className="pf-v5-c-form__label" span={spanAcr}>
            <span className="pf-v5-c-form__label-text">{t("uri")}</span>
          </GridItem>
        )}
        <GridItem className="pf-v5-c-form__label" span={spanLoA}>
          <span className="pf-v5-c-form__label-text">{t("loa")}</span>
        </GridItem>
        {fields.map((attribute, index) => {
          const error = getError()?.[index];
          return (
            <Fragment key={attribute.id}>
              <GridItem span={spanAcr}>
                <TextInput
                  placeholder={t("acrPlaceholder")}
                  aria-label={t("acr")}
                  data-testid={`${name}-acr`}
                  {...register(`${name}.${index}.acr`, { required: true })}
                  validated={error?.acr ? "error" : "default"}
                  isRequired
                />
                {error?.acr && (
                  <HelperText>
                    <HelperTextItem variant="error">
                      {t("acrError")}
                    </HelperTextItem>
                  </HelperText>
                )}
              </GridItem>
              {uri && (
                <GridItem span={spanAcr}>
                  <TextInput
                    placeholder={t("uriPlaceholder")}
                    aria-label={t("uri")}
                    data-testid={`${name}-uri`}
                    {...register(`${name}.${index}.uri`, {
                      // some validation for URI in JS????
                    })}
                    validated={error?.uri ? "error" : "default"}
                    isRequired={false}
                  />
                  {error?.uri && (
                    <HelperText>
                      <HelperTextItem variant="error">
                        {t("uriError")}
                      </HelperTextItem>
                    </HelperText>
                  )}
                </GridItem>
              )}
              <GridItem span={spanLoA}>
                <TextInput
                  placeholder={t("loaPlaceholder")}
                  aria-label={t("loa")}
                  data-testid={`${name}-loa`}
                  {...register(`${name}.${index}.loa`, {
                    required: true,
                    validate: (v: string) => Number.isInteger(parseInt(v)),
                  })}
                  validated={error?.loa ? "error" : "default"}
                  isRequired
                />
                {error?.loa && (
                  <HelperText>
                    <HelperTextItem variant="error">
                      {t("loaError")}
                    </HelperTextItem>
                  </HelperText>
                )}
              </GridItem>
              <GridItem span={2}>
                <Button
                  variant="link"
                  title={t("removeAttribute")}
                  onClick={() => remove(index)}
                  data-testid={`${name}-remove`}
                >
                  <MinusCircleIcon />
                </Button>
              </GridItem>
            </Fragment>
          );
        })}
      </Grid>
      <ActionList>
        <ActionListItem>
          <Button
            data-testid={`${name}-add-row`}
            className="pf-v5-u-px-0 pf-v5-u-mt-sm"
            variant="link"
            icon={<PlusCircleIcon />}
            onClick={appendNew}
          >
            {t("addAttribute", { label })}
          </Button>
        </ActionListItem>
      </ActionList>
    </>
  ) : (
    <EmptyState
      data-testid={`${name}-empty-state`}
      className="pf-v5-u-p-0"
      variant="xs"
    >
      <EmptyStateBody>{t("missingAttributes", { label })}</EmptyStateBody>
      <EmptyStateFooter>
        <Button
          data-testid={`${name}-add-row`}
          variant="link"
          icon={<PlusCircleIcon />}
          size="sm"
          onClick={appendNew}
        >
          {t("addAttribute", { label })}
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
};
