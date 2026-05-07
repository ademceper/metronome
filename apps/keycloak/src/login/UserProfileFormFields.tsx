import { Button } from "@metronome/ui/components/button"
import { Label } from "@metronome/ui/components/label"
import { Textarea } from "@metronome/ui/components/textarea"
import { cn } from "@metronome/ui/lib/utils"
import { CaretDown, Eye, EyeSlash } from "@phosphor-icons/react"
import type { Attribute } from "keycloakify/login/KcContext"
import {
  type FormAction,
  type FormFieldError,
  getButtonToDisplayForMultivaluedAttributeField,
  useUserProfileForm,
} from "keycloakify/login/lib/useUserProfileForm"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import { assert } from "keycloakify/tools/assert"
import type { JSX } from "keycloakify/tools/JSX"
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed"
import { Fragment, useEffect } from "react"
import { KcTextInput } from "./components/kc-form"
import type { I18n } from "./i18n"
import type { KcContext } from "./KcContext"

const selectClassName =
  "flex h-12 w-full appearance-none rounded-2xl border-transparent bg-muted px-4 py-2 pr-10 text-base transition-colors outline-none hover:bg-muted/80 focus-visible:border-transparent focus-visible:bg-muted/70 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-muted/60 dark:hover:bg-muted/70"

function isFloatingCapable(attribute: Attribute) {
  const t = attribute.annotations.inputType
  if (!t) return true
  return (
    t !== "select" &&
    t !== "multiselect" &&
    t !== "select-radiobuttons" &&
    t !== "multiselect-checkboxes" &&
    t !== "hidden"
  )
}

export default function UserProfileFormFields(
  props: UserProfileFormFieldsProps<KcContext, I18n>
) {
  const {
    kcContext,
    i18n,
    onIsFormSubmittableValueChange,
    doMakeUserConfirmPassword,
    BeforeField,
    AfterField,
  } = props

  const { advancedMsg } = i18n

  const {
    formState: { formFieldStates, isFormSubmittable },
    dispatchFormAction,
  } = useUserProfileForm({
    kcContext,
    i18n,
    doMakeUserConfirmPassword,
  })

  useEffect(() => {
    onIsFormSubmittableValueChange(isFormSubmittable)
  }, [isFormSubmittable, onIsFormSubmittableValueChange])

  const groupNameRef = { current: "" }

  return (
    <>
      {formFieldStates.map(
        ({ attribute, displayableErrors, valueOrValues }) => {
          const isHidden =
            attribute.annotations.inputType === "hidden" ||
            (attribute.name === "password-confirm" &&
              !doMakeUserConfirmPassword)

          return (
            <Fragment key={attribute.name}>
              <GroupLabel
                attribute={attribute}
                groupNameRef={groupNameRef}
                i18n={i18n}
              />
              {BeforeField !== undefined && (
                <BeforeField
                  attribute={attribute}
                  dispatchFormAction={dispatchFormAction}
                  displayableErrors={displayableErrors}
                  valueOrValues={valueOrValues}
                  kcClsx={props.kcClsx}
                  i18n={i18n}
                />
              )}
              <div
                className="space-y-1"
                style={{ display: isHidden ? "none" : undefined }}
              >
                {attribute.annotations.inputHelperTextBefore !== undefined && (
                  <p
                    className="text-muted-foreground text-sm"
                    id={`form-help-text-before-${attribute.name}`}
                    aria-live="polite"
                  >
                    {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                  </p>
                )}
                {isFloatingCapable(attribute) ? (
                  <div className="relative">
                    <InputFieldByType
                      attribute={attribute}
                      valueOrValues={valueOrValues}
                      displayableErrors={displayableErrors}
                      dispatchFormAction={dispatchFormAction}
                      i18n={i18n}
                    />
                    <Label
                      htmlFor={attribute.name}
                      className="pointer-events-none absolute top-1 left-4 z-10 text-muted-foreground text-xs transition-[top,font-size,color] duration-150 ease-out peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-foreground peer-focus:text-xs"
                    >
                      {advancedMsg(attribute.displayName ?? "")}
                      {attribute.required && (
                        <span className="ml-0.5 text-destructive">*</span>
                      )}
                    </Label>
                  </div>
                ) : (
                  <>
                    <Label htmlFor={attribute.name}>
                      {advancedMsg(attribute.displayName ?? "")}
                      {attribute.required && (
                        <span className="ml-0.5 text-destructive">*</span>
                      )}
                    </Label>
                    <InputFieldByType
                      attribute={attribute}
                      valueOrValues={valueOrValues}
                      displayableErrors={displayableErrors}
                      dispatchFormAction={dispatchFormAction}
                      i18n={i18n}
                    />
                  </>
                )}
                <FieldErrors
                  attribute={attribute}
                  displayableErrors={displayableErrors}
                  fieldIndex={undefined}
                />
                {attribute.annotations.inputHelperTextAfter !== undefined && (
                  <p
                    className="text-muted-foreground text-sm"
                    id={`form-help-text-after-${attribute.name}`}
                    aria-live="polite"
                  >
                    {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                  </p>
                )}
                {AfterField !== undefined && (
                  <AfterField
                    attribute={attribute}
                    dispatchFormAction={dispatchFormAction}
                    displayableErrors={displayableErrors}
                    valueOrValues={valueOrValues}
                    kcClsx={props.kcClsx}
                    i18n={i18n}
                  />
                )}
              </div>
            </Fragment>
          )
        }
      )}
    </>
  )
}

function GroupLabel(props: {
  attribute: Attribute
  groupNameRef: { current: string }
  i18n: I18n
}) {
  const { attribute, groupNameRef, i18n } = props

  const { advancedMsg } = i18n

  if (attribute.group?.name !== groupNameRef.current) {
    groupNameRef.current = attribute.group?.name ?? ""

    if (groupNameRef.current !== "") {
      assert(attribute.group !== undefined)

      const groupDisplayHeader = attribute.group.displayHeader ?? ""
      const groupHeaderText =
        groupDisplayHeader !== ""
          ? advancedMsg(groupDisplayHeader)
          : attribute.group.name
      const groupDisplayDescription = attribute.group.displayDescription ?? ""

      return (
        <div
          className="space-y-1 pt-2"
          {...Object.fromEntries(
            Object.entries(attribute.group.html5DataAnnotations).map(
              ([key, value]) => [`data-${key}`, value]
            )
          )}
        >
          <label
            id={`header-${attribute.group.name}`}
            className="font-medium text-base"
          >
            {groupHeaderText}
          </label>
          {groupDisplayDescription !== "" && (
            <label
              id={`description-${attribute.group.name}`}
              className="block text-muted-foreground text-sm"
            >
              {advancedMsg(groupDisplayDescription)}
            </label>
          )}
        </div>
      )
    }
  }

  return null
}

function FieldErrors(props: {
  attribute: Attribute
  displayableErrors: FormFieldError[]
  fieldIndex: number | undefined
}) {
  const { attribute, fieldIndex } = props

  const displayableErrors = props.displayableErrors.filter(
    (error) => error.fieldIndex === fieldIndex
  )

  if (displayableErrors.length === 0) {
    return null
  }

  return (
    <p
      id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
      className="text-destructive text-sm"
      aria-live="polite"
    >
      {displayableErrors.map(({ errorMessage }, i, arr) => (
        <Fragment key={i}>
          {errorMessage}
          {arr.length - 1 !== i && <br />}
        </Fragment>
      ))}
    </p>
  )
}

type InputFieldByTypeProps = {
  attribute: Attribute
  valueOrValues: string | string[]
  displayableErrors: FormFieldError[]
  dispatchFormAction: React.Dispatch<FormAction>
  i18n: I18n
}

function InputFieldByType(props: InputFieldByTypeProps) {
  const { attribute, valueOrValues } = props

  switch (attribute.annotations.inputType) {
    case "hidden":
      return <input type="hidden" name={attribute.name} value={valueOrValues} />
    case "textarea":
      return <TextareaTag {...props} />
    case "select":
    case "multiselect":
      return <SelectTag {...props} />
    case "select-radiobuttons":
    case "multiselect-checkboxes":
      return <InputTagSelects {...props} />
    default: {
      if (Array.isArray(valueOrValues)) {
        return (
          <>
            {valueOrValues.map((...[, i]) => (
              <InputTag key={i} {...props} fieldIndex={i} />
            ))}
          </>
        )
      }

      const inputNode = <InputTag {...props} fieldIndex={undefined} />

      if (
        attribute.name === "password" ||
        attribute.name === "password-confirm"
      ) {
        return (
          <PasswordWrapper i18n={props.i18n} passwordInputId={attribute.name}>
            {inputNode}
          </PasswordWrapper>
        )
      }

      return inputNode
    }
  }
}

function PasswordWrapper(props: {
  i18n: I18n
  passwordInputId: string
  children: JSX.Element
}) {
  const { i18n, passwordInputId, children } = props

  const { msgStr } = i18n

  const { isPasswordRevealed, toggleIsPasswordRevealed } =
    useIsPasswordRevealed({ passwordInputId })

  return (
    <>
      {children}
      <button
        type="button"
        aria-label={msgStr(
          isPasswordRevealed ? "hidePassword" : "showPassword"
        )}
        aria-controls={passwordInputId}
        onClick={toggleIsPasswordRevealed}
        className="absolute inset-y-0 right-0 z-10 flex items-center px-4 text-muted-foreground hover:text-foreground"
      >
        {isPasswordRevealed ? (
          <EyeSlash className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </>
  )
}

function InputTag(
  props: InputFieldByTypeProps & { fieldIndex: number | undefined }
) {
  const {
    attribute,
    fieldIndex,
    dispatchFormAction,
    valueOrValues,
    i18n,
    displayableErrors,
  } = props

  const { advancedMsgStr } = i18n

  const invalid =
    displayableErrors.find((error) => error.fieldIndex === fieldIndex) !==
    undefined

  const isPassword =
    attribute.name === "password" || attribute.name === "password-confirm"

  return (
    <>
      <KcTextInput
        type={(() => {
          const { inputType } = attribute.annotations

          if (inputType?.startsWith("html5-")) {
            return inputType.slice(6)
          }

          return inputType ?? "text"
        })()}
        id={attribute.name}
        name={attribute.name}
        value={(() => {
          if (fieldIndex !== undefined) {
            assert(Array.isArray(valueOrValues))
            return valueOrValues[fieldIndex]
          }

          assert(typeof valueOrValues === "string")

          return valueOrValues
        })()}
        className={cn(isPassword && "pr-10")}
        invalid={invalid}
        disabled={attribute.readOnly}
        autoComplete={attribute.autocomplete}
        placeholder={
          attribute.annotations.inputTypePlaceholder === undefined
            ? undefined
            : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
        }
        pattern={attribute.annotations.inputTypePattern}
        maxLength={
          attribute.annotations.inputTypeMaxlength === undefined
            ? undefined
            : parseInt(`${attribute.annotations.inputTypeMaxlength}`, 10)
        }
        minLength={
          attribute.annotations.inputTypeMinlength === undefined
            ? undefined
            : parseInt(`${attribute.annotations.inputTypeMinlength}`, 10)
        }
        max={attribute.annotations.inputTypeMax}
        min={attribute.annotations.inputTypeMin}
        step={attribute.annotations.inputTypeStep}
        {...Object.fromEntries(
          Object.entries(attribute.html5DataAnnotations ?? {}).map(
            ([key, value]) => [`data-${key}`, value]
          )
        )}
        onChange={(event) =>
          dispatchFormAction({
            action: "update",
            name: attribute.name,
            valueOrValues: (() => {
              if (fieldIndex !== undefined) {
                assert(Array.isArray(valueOrValues))

                return valueOrValues.map((value, i) => {
                  if (i === fieldIndex) {
                    return event.target.value
                  }

                  return value
                })
              }

              return event.target.value
            })(),
          })
        }
        onBlur={() =>
          dispatchFormAction({
            action: "focus lost",
            name: attribute.name,
            fieldIndex: fieldIndex,
          })
        }
      />
      {(() => {
        if (fieldIndex === undefined) {
          return null
        }

        assert(Array.isArray(valueOrValues))

        const values = valueOrValues

        return (
          <>
            <FieldErrors
              attribute={attribute}
              displayableErrors={displayableErrors}
              fieldIndex={fieldIndex}
            />
            <AddRemoveButtonsMultiValuedAttribute
              attribute={attribute}
              values={values}
              fieldIndex={fieldIndex}
              dispatchFormAction={dispatchFormAction}
              i18n={i18n}
            />
          </>
        )
      })()}
    </>
  )
}

function AddRemoveButtonsMultiValuedAttribute(props: {
  attribute: Attribute
  values: string[]
  fieldIndex: number
  dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>
  i18n: I18n
}) {
  const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props

  const { msg } = i18n

  const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({
    attribute,
    values,
    fieldIndex,
  })

  const idPostfix = `-${attribute.name}-${fieldIndex + 1}`

  return (
    <div className="flex items-center gap-2">
      {hasRemove && (
        <Button
          id={`kc-remove${idPostfix}`}
          type="button"
          variant="link"
          className="h-auto p-0"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: values.filter((_, i) => i !== fieldIndex),
            })
          }
        >
          {msg("remove")}
        </Button>
      )}
      {hasAdd && (
        <Button
          id={`kc-add${idPostfix}`}
          type="button"
          variant="link"
          className="h-auto p-0"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: [...values, ""],
            })
          }
        >
          {msg("addValue")}
        </Button>
      )}
    </div>
  )
}

function InputTagSelects(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, i18n, valueOrValues } = props

  const { inputType } = attribute.annotations

  assert(
    inputType === "select-radiobuttons" ||
      inputType === "multiselect-checkboxes"
  )

  const isCheckbox = inputType === "multiselect-checkboxes"

  const options = (() => {
    walk: {
      const { inputOptionsFromValidation } = attribute.annotations

      if (inputOptionsFromValidation === undefined) {
        break walk
      }

      const validator = (
        attribute.validators as Record<string, { options?: string[] }>
      )[inputOptionsFromValidation]

      if (validator === undefined) {
        break walk
      }

      if (validator.options === undefined) {
        break walk
      }

      return validator.options
    }

    return attribute.validators.options?.options ?? []
  })()

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const optionId = `${attribute.name}-${option}`
        const checked = Array.isArray(valueOrValues)
          ? valueOrValues.includes(option)
          : valueOrValues === option

        const onChange = (isChecked: boolean) => {
          dispatchFormAction({
            action: "update",
            name: attribute.name,
            valueOrValues: (() => {
              if (Array.isArray(valueOrValues)) {
                const newValues = [...valueOrValues]

                if (isChecked) {
                  newValues.push(option)
                } else {
                  newValues.splice(newValues.indexOf(option), 1)
                }

                return newValues
              }

              return isChecked ? option : ""
            })(),
          })
        }

        const onBlur = () =>
          dispatchFormAction({
            action: "focus lost",
            name: attribute.name,
            fieldIndex: undefined,
          })

        return (
          <label
            key={option}
            htmlFor={optionId}
            className={cn(
              "flex items-center gap-2 text-sm",
              attribute.readOnly && "cursor-not-allowed opacity-50"
            )}
          >
            <input
              type={isCheckbox ? "checkbox" : "radio"}
              id={optionId}
              name={attribute.name}
              value={option}
              aria-invalid={props.displayableErrors.length !== 0}
              disabled={attribute.readOnly}
              checked={checked}
              onChange={(event) => onChange(event.target.checked)}
              onBlur={onBlur}
              className="size-4"
            />
            <span>{inputLabel(i18n, attribute, option)}</span>
          </label>
        )
      })}
    </div>
  )
}

function TextareaTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, valueOrValues } =
    props

  assert(typeof valueOrValues === "string")

  const value = valueOrValues

  return (
    <Textarea
      id={attribute.name}
      name={attribute.name}
      aria-invalid={displayableErrors.length !== 0}
      disabled={attribute.readOnly}
      placeholder=" "
      className="peer border-transparent bg-muted pt-5 pb-1 placeholder:text-transparent hover:bg-muted/80 focus-visible:border-transparent focus-visible:bg-muted/70 focus-visible:ring-0 dark:bg-muted/60 dark:hover:bg-muted/70"
      cols={
        attribute.annotations.inputTypeCols === undefined
          ? undefined
          : parseInt(`${attribute.annotations.inputTypeCols}`, 10)
      }
      rows={
        attribute.annotations.inputTypeRows === undefined
          ? undefined
          : parseInt(`${attribute.annotations.inputTypeRows}`, 10)
      }
      maxLength={
        attribute.annotations.inputTypeMaxlength === undefined
          ? undefined
          : parseInt(`${attribute.annotations.inputTypeMaxlength}`, 10)
      }
      value={value}
      onChange={(event) =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: event.target.value,
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined,
        })
      }
    />
  )
}

function SelectTag(props: InputFieldByTypeProps) {
  const {
    attribute,
    dispatchFormAction,
    displayableErrors,
    i18n,
    valueOrValues,
  } = props

  const isMultiple = attribute.annotations.inputType === "multiselect"

  const options = (() => {
    walk: {
      const { inputOptionsFromValidation } = attribute.annotations
      if (inputOptionsFromValidation === undefined) break walk
      assert(typeof inputOptionsFromValidation === "string")
      const validator = (
        attribute.validators as Record<string, { options?: string[] }>
      )[inputOptionsFromValidation]
      if (validator === undefined) break walk
      if (validator.options === undefined) break walk
      return validator.options
    }
    return attribute.validators.options?.options ?? []
  })()

  const optionNodes = options.map((option) => (
    <option key={option} value={option}>
      {inputLabel(i18n, attribute, option)}
    </option>
  ))

  const select = (
    <select
      id={attribute.name}
      name={attribute.name}
      className={cn(selectClassName, isMultiple && "h-auto py-2 pr-4")}
      aria-invalid={displayableErrors.length !== 0}
      disabled={attribute.readOnly}
      multiple={isMultiple}
      size={
        attribute.annotations.inputTypeSize === undefined
          ? undefined
          : parseInt(`${attribute.annotations.inputTypeSize}`, 10)
      }
      value={valueOrValues}
      onChange={(event) =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: (() => {
            if (isMultiple) {
              return Array.from(event.target.selectedOptions).map(
                (option) => option.value
              )
            }

            return event.target.value
          })(),
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined,
        })
      }
    >
      {!isMultiple && <option value=""></option>}
      {optionNodes}
    </select>
  )

  if (isMultiple) return select

  return (
    <div className="relative">
      {select}
      <CaretDown
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  )
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
  const { advancedMsg } = i18n

  if (attribute.annotations.inputOptionLabels !== undefined) {
    const { inputOptionLabels } = attribute.annotations

    return advancedMsg(inputOptionLabels[option] ?? option)
  }

  if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
    return advancedMsg(
      `${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`
    )
  }

  return option
}
