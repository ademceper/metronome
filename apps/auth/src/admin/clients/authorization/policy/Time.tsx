/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/Time.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormErrorText, HelpItem } from "../../../../shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";


const DatePicker = ({ value, onChange, ...props }: any) => (
  <UIInput type="date" value={value ?? ""}
    onChange={(e: any) => onChange?.(e, e.target.value)} {...props} />
);
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
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
const NumberInput = ({ value, onChange, min, max, step, ...props }: any) => (
  <UIInput type="number" value={value ?? ""}
    onChange={(e: any) => onChange?.(e)} min={min} max={max} step={step} {...props} />
);
const Radio = ({ id, name, label, description, isChecked, onChange, isDisabled, value, ...props }: any) => (
  <div className="flex items-start gap-2">
    <input type="radio" id={id} name={name} value={value} checked={!!isChecked} disabled={isDisabled}
      onChange={(e) => onChange?.(e, e.target.checked)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);
const TimePicker = ({ time, onChange, ...props }: any) => (
  <UIInput type="time" value={time ?? ""}
    onChange={(e: any) => onChange?.(e, e.target.value)} {...props} />
);

const DATE_TIME_FORMAT = /(\d\d\d\d-\d\d-\d\d)? (\d\d?):(\d\d?)/;
const padDateSegment = (value: number) => value.toString().padStart(2, "0");

const DateTime = ({ name }: { name: string }) => {
  const { control } = useFormContext();

  const parseDate = (value: string, date?: Date): string => {
    if (!date) {
      return value;
    }

    const parts = DATE_TIME_FORMAT.exec(value);
    const parsedDate = [
      date.getFullYear(),
      padDateSegment(date.getMonth() + 1),
      padDateSegment(date.getDate()),
    ].join("-");

    return `${parsedDate} ${parts ? parts[2] : "00"}:${
      parts ? parts[3] : "00"
    }:00`;
  };

  const parseTime = (
    value: string,
    hour?: number | null,
    minute?: number | null,
  ): string => {
    const parts = DATE_TIME_FORMAT.exec(value);
    if (minute !== undefined && minute !== null) {
      return `${parts ? parts[1] : ""} ${hour}:${
        minute < 10 ? `0${minute}` : minute
      }:00`;
    }
    return value;
  };

  return (
    <Controller
      name={name}
      defaultValue=""
      control={control}
      rules={{ required: true }}
      render={({ field }) => {
        const dateTime = field.value.match(DATE_TIME_FORMAT) || [
          "",
          "",
          "0",
          "00",
        ];
        return (
          <Split hasGutter id={name}>
            <SplitItem>
              <DatePicker
                value={dateTime[1]}
                onChange={(event, value, date) => {
                  field.onChange(parseDate(field.value, date));
                }}
              />
            </SplitItem>
            <SplitItem>
              <TimePicker
                time={`${dateTime[2]}:${dateTime[3]}`}
                onChange={(event, time, hour, minute) =>
                  field.onChange(parseTime(field.value, hour, minute))
                }
                is24Hour
              />
            </SplitItem>
          </Split>
        );
      }}
    />
  );
};

type NumberControlProps = {
  name: string;
  min: number;
  max: number;
};

const NumberControl = ({ name, min, max }: NumberControlProps) => {
  const { control } = useFormContext();
  const setValue = (newValue: number) => Math.min(newValue, max);

  return (
    <Controller
      name={name}
      defaultValue=""
      control={control}
      render={({ field }) => (
        <NumberInput
          id={name}
          value={field.value}
          min={min}
          max={max}
          onPlus={() => field.onChange(Number(field.value) + 1)}
          onMinus={() => field.onChange(Number(field.value) - 1)}
          onChange={(event) => {
            const newValue = Number(event.currentTarget.value);
            field.onChange(setValue(!isNaN(newValue) ? newValue : 0));
          }}
        />
      )}
    />
  );
};

const FromTo = ({ name, ...rest }: NumberControlProps) => {
  const { t } = useTranslation();

  return (
    <FormGroup
      label={t(name)}
      fieldId={name}
      labelIcon={<HelpItem helpText={t(`${name}Help`)} fieldLabelId={name} />}
    >
      <Split hasGutter>
        <SplitItem>
          <NumberControl name={name} {...rest} />
        </SplitItem>
        <SplitItem>{t("to")}</SplitItem>
        <SplitItem>
          <NumberControl name={`${name}End`} {...rest} />
        </SplitItem>
      </Split>
    </FormGroup>
  );
};

export const Time = () => {
  const { t } = useTranslation();
  const {
    getValues,
    formState: { errors },
  } = useFormContext();
  const [repeat, setRepeat] = useState(getValues("month"));
  return (
    <>
      <FormGroup
        label={t("repeat")}
        fieldId="repeat"
        labelIcon={
          <HelpItem helpText={t("repeatHelp")} fieldLabelId="repeat" />
        }
      >
        <Flex>
          <FlexItem>
            <Radio
              id="notRepeat"
              data-testid="notRepeat"
              isChecked={!repeat}
              name="repeat"
              onChange={() => setRepeat(false)}
              label={t("notRepeat")}
              className="pf-v5-u-mb-md"
            />
          </FlexItem>
          <FlexItem>
            <Radio
              id="repeat"
              data-testid="repeat"
              isChecked={repeat}
              name="repeat"
              onChange={() => setRepeat(true)}
              label={t("repeat")}
              className="pf-v5-u-mb-md"
            />
          </FlexItem>
        </Flex>
      </FormGroup>
      {repeat && (
        <>
          <FromTo name="month" min={1} max={12} />
          <FromTo name="dayMonth" min={1} max={31} />
          <FromTo name="hour" min={0} max={23} />
          <FromTo name="minute" min={0} max={59} />
        </>
      )}
      <FormGroup
        label={t("startTime")}
        fieldId="notBefore"
        labelIcon={
          <HelpItem helpText={t("startTimeHelp")} fieldLabelId="startTime" />
        }
        isRequired
      >
        <DateTime name="notBefore" />
        {errors.notBefore && <FormErrorText message={t("required")} />}
      </FormGroup>
      <FormGroup
        label={t("expireTime")}
        fieldId="notOnOrAfter"
        labelIcon={
          <HelpItem helpText={t("expireTimeHelp")} fieldLabelId="expireTime" />
        }
        isRequired
      >
        <DateTime name="notOnOrAfter" />
        {errors.notOnOrAfter && <FormErrorText message={t("required")} />}
      </FormGroup>
    </>
  );
};
