/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/OptionsComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { Controller } from "react-hook-form";
import {
  OptionLabel,
  Options,
  UserProfileFieldProps,
} from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, isRequiredAttribute, label } from "./utils";


const Checkbox = ({ id, label, description, isChecked, isDisabled, onChange, name, ...props }: any) => (
  <div className="flex items-start gap-2">
    <UICheckbox id={id} name={name} checked={isChecked} disabled={isDisabled}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
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

export const OptionComponent = (props: UserProfileFieldProps) => {
  const { form, inputType, attribute } = props;
  const isRequired = isRequiredAttribute(attribute);
  const isMultiSelect = inputType.startsWith("multiselect");
  const Component = isMultiSelect ? Checkbox : Radio;
  const options =
    (attribute.validators?.options as Options | undefined)?.options || [];

  const optionLabel =
    (attribute.annotations?.["inputOptionLabels"] as OptionLabel) || {};
  const prefix = attribute.annotations?.[
    "inputOptionLabelsI18nPrefix"
  ] as string;

  return (
    <UserProfileGroup {...props}>
      <Controller
        name={fieldName(attribute.name)}
        control={form.control}
        defaultValue={attribute.defaultValue}
        render={({ field }) => (
          <>
            {options.map((option) => (
              <Component
                key={option}
                id={option}
                data-testid={option}
                label={label(props.t, optionLabel[option], option, prefix)}
                value={option}
                isChecked={field.value?.includes(option)}
                onChange={() => {
                  if (isMultiSelect) {
                    if (field.value?.includes(option)) {
                      field.onChange(
                        field.value?.filter((item: string) => item !== option),
                      );
                    } else {
                      field.onChange([...(field.value || []), option]);
                    }
                  } else {
                    field.onChange([option]);
                  }
                }}
                readOnly={attribute.readOnly}
                isRequired={isRequired}
              />
            ))}
          </>
        )}
      />
    </UserProfileGroup>
  );
};
