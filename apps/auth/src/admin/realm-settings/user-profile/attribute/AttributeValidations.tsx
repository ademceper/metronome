/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/attribute/AttributeValidations.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { cn } from "@metronome/ui/lib/utils";
import { PlusCircle as PlusCircleIcon } from "@phosphor-icons/react"
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useConfirmDialog } from "../../../components/confirm-dialog/ConfirmDialog";
import { DefaultValue } from "../../../components/key-value-form/KeyValueInput";
import useToggle from "../../../utils/useToggle";
import type { IndexedValidations } from "../../NewAttributeSettings";
import { AddValidatorDialog } from "../attribute/AddValidatorDialog";

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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;

export const AttributeValidations = () => {
  const { t } = useTranslation();
  const [addValidatorModalOpen, toggleModal] = useToggle();
  const [validatorToDelete, setValidatorToDelete] = useState<string>();
  const { setValue, control, register, getValues } = useFormContext();

  const validators: IndexedValidations[] = useWatch({
    name: "validations",
    control,
    defaultValue: [],
  });

  useEffect(() => {
    register("validations");
  }, [register]);

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteValidatorConfirmTitle"),
    messageKey: t("deleteValidatorConfirmMsg", {
      validatorName: validatorToDelete,
    }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      const updatedValidators = validators.filter(
        (validator) => validator.key !== validatorToDelete,
      );

      setValue("validations", [...updatedValidators]);
    },
  });

  return (
    <>
      {addValidatorModalOpen && (
        <AddValidatorDialog
          selectedValidators={validators}
          onConfirm={(newValidator) => {
            const annotations: DefaultValue[] = getValues("annotations");
            if (
              newValidator.id === "options" &&
              !annotations.find((a) => a.key === "inputType")
            ) {
              setValue("annotations", [
                ...annotations,
                { key: "inputType", value: "select" },
              ]);
            }
            setValue("validations", [
              ...validators,
              { key: newValidator.id, value: newValidator.config },
            ]);
          }}
          toggleDialog={toggleModal}
        />
      )}
      <DeleteConfirm />
      <div className="kc-attributes-validations">
        <Button
          id="addValidator"
          onClick={() => toggleModal()}
          variant="link"
          data-testid="addValidator"
          className="kc--attributes-validations--add-validation-button"
          icon={<PlusCircleIcon />}
        >
          {t("addValidator")}
        </Button>
        <Divider />
        {validators.length !== 0 ? (
          <Table>
            <Thead>
              <Tr>
                <Th>{t("validatorColNames.colName")}</Th>
                <Th>{t("validatorColNames.colConfig")}</Th>
                <Th aria-hidden="true" />
              </Tr>
            </Thead>
            <Tbody>
              {validators.map((validator) => (
                <Tr key={validator.key}>
                  <Td dataLabel={t("validatorColNames.colName")}>
                    {validator.key}
                  </Td>
                  <Td dataLabel={t("validatorColNames.colConfig")}>
                    {JSON.stringify(validator.value)}
                  </Td>
                  <Td className="kc--attributes-validations--action-cell">
                    <Button
                      key="validator"
                      variant="link"
                      data-testid="deleteValidator"
                      onClick={() => {
                        toggleDeleteDialog();
                        setValidatorToDelete(validator.key);
                      }}
                    >
                      {t("delete")}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text className="kc-emptyValidators" component={TextVariants.p}>
            {t("emptyValidators")}
          </Text>
        )}
      </div>
    </>
  );
};
