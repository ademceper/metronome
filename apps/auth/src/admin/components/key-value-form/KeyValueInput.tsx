/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/key-value-form/KeyValueInput.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { MinusCircle as MinusCircleIcon, PlusCircle as PlusCircleIcon } from "@phosphor-icons/react"
import { Fragment, FunctionComponent, PropsWithChildren } from "react";
import {
  FieldValues,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
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

export type DefaultValue = {
  key: string;
  values?: string[];
  label: string;
};

type Field = {
  name: string;
  error: boolean;
};

type ValueField = Field & {
  keyValue: string;
};

type KeyValueInputProps = PropsWithChildren & {
  name: string;
  label?: string;
  isDisabled?: boolean;
  keyLabel?: string;
  valueLabel?: string;
  KeyComponent?: FunctionComponent<Field>;
  ValueComponent?: FunctionComponent<ValueField>;
};

export const KeyValueInput = ({
  name,
  label = "attributes",
  isDisabled = false,
  keyLabel = "key",
  valueLabel = "value",
  KeyComponent,
  ValueComponent,
}: KeyValueInputProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const appendNew = () => append({ key: "", value: "" });

  const values = useWatch<FieldValues>({
    name,
    control,
    defaultValue: [],
  });

  const getError = () => {
    return name.split(".").reduce((record: any, key) => record?.[key], errors);
  };

  return fields.length > 0 ? (
    <>
      <Grid hasGutter>
        <GridItem className="pf-v5-c-form__label" span={5}>
          <span className="pf-v5-c-form__label-text">{t(keyLabel)}</span>
        </GridItem>
        <GridItem className="pf-v5-c-form__label" span={7}>
          <span className="pf-v5-c-form__label-text">{t(valueLabel)}</span>
        </GridItem>
        {fields.map((attribute, index) => {
          const error = getError()?.[index];
          const keyError = !!error?.key;
          const valueErrorPresent = !!error?.value || !!error?.message;
          const valueError = error?.message || t(`${valueLabel}Error`);
          return (
            <Fragment key={attribute.id}>
              <GridItem span={5}>
                {KeyComponent ? (
                  <KeyComponent
                    name={`${name}.${index}.key`}
                    error={keyError}
                  />
                ) : (
                  <TextInput
                    placeholder={t(`${keyLabel}Placeholder`)}
                    aria-label={t(keyLabel)}
                    data-testid={`${name}-key`}
                    {...register(`${name}.${index}.key`, { required: true })}
                    validated={keyError ? "error" : "default"}
                    isRequired
                    isDisabled={isDisabled}
                  />
                )}
                {keyError && (
                  <HelperText>
                    <HelperTextItem variant="error">
                      {t(`${keyLabel}Error`)}
                    </HelperTextItem>
                  </HelperText>
                )}
              </GridItem>
              <GridItem span={5}>
                {ValueComponent ? (
                  <ValueComponent
                    name={`${name}.${index}.value`}
                    keyValue={values[index]?.key}
                    error={valueErrorPresent}
                  />
                ) : (
                  <TextInput
                    placeholder={t(`${valueLabel}Placeholder`)}
                    aria-label={t(valueLabel)}
                    data-testid={`${name}-value`}
                    {...register(`${name}.${index}.value`, { required: true })}
                    validated={valueErrorPresent ? "error" : "default"}
                    isRequired
                    isDisabled={isDisabled}
                  />
                )}
                {valueErrorPresent && (
                  <HelperText>
                    <HelperTextItem variant="error">
                      {valueError}
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
                  isDisabled={isDisabled}
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
            isDisabled={isDisabled}
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
          isDisabled={isDisabled}
        >
          {t("addAttribute", { label })}
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
};
