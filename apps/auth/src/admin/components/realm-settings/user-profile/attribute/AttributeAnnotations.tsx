/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/attribute/AttributeAnnotations.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormAccess } from "../../../form/FormAccess";
import { KeyValueInput } from "../../../key-value-form/KeyValueInput";
import { KeySelect } from "./KeySelect";
import { ValueSelect } from "./ValueSelect";

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
const Grid = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-2", className)} {...props}>{children}</div>
);
const GridItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

export const AttributeAnnotations = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <FormAccess role="manage-realm" isHorizontal>
      <FormGroup
        hasNoPaddingTop
        label={t("annotations")}
        fieldId="kc-annotations"
        className="kc-annotations-label"
      >
        <Grid className="kc-annotations">
          <GridItem>
            <KeyValueInput
              name="annotations"
              label={t("annotations")}
              KeyComponent={(props) => (
                <KeySelect
                  {...props}
                  selectItems={[
                    {
                      key: "inputType",
                      value: t("inputType"),
                    },
                    {
                      key: "inputHelperTextBefore",
                      value: t("inputHelperTextBefore"),
                    },
                    {
                      key: "inputHelperTextAfter",
                      value: t("inputHelperTextAfter"),
                    },
                    {
                      key: "inputOptionLabelsI18nPrefix",
                      value: t("inputOptionLabelsI18nPrefix"),
                    },
                    {
                      key: "inputTypePlaceholder",
                      value: t("inputTypePlaceholder"),
                    },
                    {
                      key: "inputTypeSize",
                      value: t("inputTypeSize"),
                    },
                    {
                      key: "inputTypeCols",
                      value: t("inputTypeCols"),
                    },
                    {
                      key: "inputTypeRows",
                      value: t("inputTypeRows"),
                    },
                    {
                      key: "inputTypeStep",
                      value: t("inputTypeStep"),
                    },
                    {
                      key: "kcNumberFormat",
                      value: t("kcNumberFormat"),
                    },
                    {
                      key: "kcNumberUnFormat",
                      value: t("kcNumberUnFormat"),
                    },
                  ]}
                />
              )}
              ValueComponent={(props) =>
                props.keyValue === "inputType" ? (
                  <ValueSelect
                    selectItems={[
                      "text",
                      "textarea",
                      "select",
                      "select-radiobuttons",
                      "multiselect",
                      "multiselect-checkboxes",
                      "html5-email",
                      "html5-tel",
                      "html5-url",
                      "html5-number",
                      "html5-range",
                      "html5-datetime-local",
                      "html5-date",
                      "html5-month",
                      "html5-week",
                      "html5-time",
                    ]}
                    {...props}
                  />
                ) : (
                  <TextInput
                    aria-label={t("customValue")}
                    data-testid={props.name}
                    {...props}
                    {...register(props.name)}
                  />
                )
              }
            />
          </GridItem>
        </Grid>
      </FormGroup>
    </FormAccess>
  );
};
