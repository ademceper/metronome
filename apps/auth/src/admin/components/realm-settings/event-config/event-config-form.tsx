/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/event-config/EventConfigForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, FormProvider, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../../../shared/keycloak-ui-shared";
import { DefaultSwitchControl } from "../../switch-control";
import { useConfirmDialog } from "../../confirm-dialog/confirm-dialog";
import { TimeSelectorControl } from "../../time-selector/time-selector-control";


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
const Divider = (props: any) => <UISeparator {...props} />;
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
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);

export type EventsType = "admin" | "user";

type EventConfigFormProps = {
  type: EventsType;
  form: UseFormReturn;
  reset: () => void;
  clear: () => void;
};

export const EventConfigForm = ({
  type,
  form,
  reset,
  clear,
}: EventConfigFormProps) => {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { isDirty },
  } = form;
  const eventKey = type === "admin" ? "adminEventsEnabled" : "eventsEnabled";
  const eventsEnabled: boolean = watch(eventKey);

  const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
    titleKey: "events-disable-title",
    messageKey: "events-disable-confirm",
    continueButtonLabel: "confirm",
    onConfirm: () => setValue(eventKey, false, { shouldDirty: true }),
  });

  return (
    <FormProvider {...form}>
      <DisableConfirm />
      <FormGroup
        hasNoPaddingTop
        label={t("saveEvents")}
        fieldId={eventKey}
        labelIcon={
          <HelpItem
            helpText={t(`save-${type}-eventsHelp`)}
            fieldLabelId="saveEvents"
          />
        }
      >
        <Controller
          name={eventKey}
          defaultValue={false}
          control={control}
          render={({ field }) => (
            <Switch
              data-testid={eventKey}
              id={`${eventKey}-switch`}
              label={t("on")}
              labelOff={t("off")}
              isChecked={field.value}
              onChange={(_event, value) => {
                if (!value) {
                  toggleDisableDialog();
                } else {
                  field.onChange(value);
                }
              }}
              aria-label={t("saveEvents")}
            />
          )}
        />
      </FormGroup>
      {type === "admin" && (
        <DefaultSwitchControl
          name="adminEventsDetailsEnabled"
          label={t("includeRepresentation")}
          labelIcon={t("includeRepresentationHelp")}
        />
      )}
      {eventsEnabled && (
        <TimeSelectorControl
          name={type === "user" ? "eventsExpiration" : "adminEventsExpiration"}
          label={t("expiration")}
          labelIcon={t("expirationHelp")}
          defaultValue=""
          units={["minute", "hour", "day"]}
          controller={{
            defaultValue: "",
          }}
        />
      )}
      <ActionGroup>
        <Button
          variant="primary"
          type="submit"
          id={`save-${type}`}
          data-testid={`save-${type}`}
          isDisabled={!isDirty}
        >
          {t("save")}
        </Button>
        <Button variant="link" onClick={reset}>
          {t("revert")}
        </Button>
      </ActionGroup>
      <Divider />
      <FormGroup
        label={type === "user" ? t("clearUserEvents") : t("clearAdminEvents")}
        fieldId={`clear-${type}-events`}
        labelIcon={
          <HelpItem
            helpText={t(`${type}-clearEventsHelp`)}
            fieldLabelId={`clear-${type}-events`}
          />
        }
      >
        <Button
          variant="danger"
          id={`clear-${type}-events`}
          data-testid={`clear-${type}-events`}
          onClick={() => clear()}
        >
          {type === "user" ? t("clearUserEvents") : t("clearAdminEvents")}
        </Button>
      </FormGroup>
    </FormProvider>
  );
};
