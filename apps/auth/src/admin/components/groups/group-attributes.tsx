/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/GroupAttributes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { useAlerts, useFetch } from "../../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  AttributeForm,
  AttributesForm,
} from "../key-value-form/attribute-form";
import { arrayToKeyValue } from "../key-value-form/key-value-convert";
import { convertFormValuesToObject } from "../../util";
import { getLastId } from "./group-id-utils";
import { useGroupResource } from "../../context/group-resource/group-resource-context";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const PageSectionVariants = {
  default: "default",
  light: "light",
  dark: "dark",
  darker: "darker",
} as const;

export const GroupAttributes = () => {
  const groups = useGroupResource();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const form = useForm<AttributeForm>({
    mode: "onChange",
  });

  const location = useLocation();
  const id = getLastId(location.pathname)!;
  const [currentGroup, setCurrentGroup] = useState<GroupRepresentation>();

  useFetch(
    () => groups.findOne({ id }),
    (group) => {
      form.reset({
        attributes: arrayToKeyValue(group?.attributes!),
      });
      setCurrentGroup(group);
    },
    [id],
  );

  const save = async (attributeForm: AttributeForm) => {
    try {
      const attributes = convertFormValuesToObject(attributeForm).attributes;
      await groups.update({ id: id! }, { ...currentGroup, attributes });

      setCurrentGroup({ ...currentGroup, attributes });
      addAlert(t("groupUpdated"), AlertVariant.success);
    } catch (error) {
      addError("groupUpdateError", error);
    }
  };

  return (
    <PageSection variant={PageSectionVariants.light}>
      <AttributesForm
        form={form}
        save={save}
        fineGrainedAccess={currentGroup?.access?.manage}
        reset={() =>
          form.reset({
            attributes: arrayToKeyValue(currentGroup?.attributes!),
          })
        }
      />
    </PageSection>
  );
};
