/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm/add/NewRealmForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import {
  FormSubmitButton,
  TextControl,
  useAlerts,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { FormAccess } from "../../components/form/FormAccess";
import { JsonFileUpload } from "../../components/json-file-upload/JsonFileUpload";
import { DefaultSwitchControl } from "../../components/SwitchControl";
import { useWhoAmI } from "../../context/whoami/WhoAmI";
import { convertFormValuesToObject, convertToFormValues } from "../../util";
import { toRealm } from "../../lib/realm";


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
const Modal = ({ isOpen, onClose, title, description, variant, actions, header, footer, children, ...props }: any) => (
  <UIDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
    <UIDialogContent {...props}>
      {(title || header) ? (
        <UIDialogHeader>
          {title ? <UIDialogTitle>{title}</UIDialogTitle> : null}
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          {header}
        </UIDialogHeader>
      ) : null}
      {children}
      {(actions || footer) ? (
        <UIDialogFooter>
          {actions}
          {footer}
        </UIDialogFooter>
      ) : null}
    </UIDialogContent>
  </UIDialog>
);

type NewRealmFormProps = {
  onClose: () => void;
};

export default function NewRealmForm({ onClose }: NewRealmFormProps) {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refresh, whoAmI } = useWhoAmI();
  const { addAlert, addError } = useAlerts();
  const [realm, setRealm] = useState<RealmRepresentation>();

  const form = useForm<RealmRepresentation>({
    mode: "onChange",
  });

  const { handleSubmit, setValue, formState } = form;

  const handleFileChange = (obj?: object) => {
    const defaultRealm = { id: "", realm: "", enabled: true };
    convertToFormValues(obj || defaultRealm, setValue);
    setRealm(obj || defaultRealm);
  };

  const save = async (fields: RealmRepresentation) => {
    try {
      await adminClient.realms.create({
        ...realm,
        ...convertFormValuesToObject(fields),
      });
      addAlert(t("saveRealmSuccess"));

      refresh();
      onClose();
      navigate(toRealm({ realm: fields.realm! }));
    } catch (error) {
      addError("saveRealmError", error);
    }
  };

  return (
    <Modal
      variant="medium"
      title={t("createRealm")}
      description={t("realmExplain")}
      onClose={onClose}
      isOpen
      actions={[
        <FormSubmitButton
          form="realm-form"
          data-testid="create"
          formState={formState}
          allowInvalid
          allowNonDirty
          key="confirm"
        >
          {t("create")}
        </FormSubmitButton>,
        <Button
          variant="link"
          onClick={onClose}
          key={"cancel"}
          data-testid="cancel"
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <FormProvider {...form}>
        <FormAccess
          id="realm-form"
          isHorizontal
          onSubmit={handleSubmit(save)}
          role="query-realms"
          isReadOnly={!whoAmI.createRealm}
        >
          <JsonFileUpload
            id="kc-realm-filename"
            allowEditingUploadedText
            onChange={handleFileChange}
          />
          <TextControl
            name="realm"
            label={t("realmNameField")}
            rules={{ required: t("required") }}
          />
          <DefaultSwitchControl
            name="enabled"
            label={t("enabled")}
            defaultValue={true}
          />
        </FormAccess>
      </FormProvider>
    </Modal>
  );
}
