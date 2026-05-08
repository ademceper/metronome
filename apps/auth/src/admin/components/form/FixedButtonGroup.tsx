/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/form/FixedButtonGroup.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import {
  ActionGroup,
  ActionGroupProps,
  Button,
} from "../../../shared/@patternfly/react-core";

import style from "./fixed-buttons.module.css";

type FixedButtonGroupProps = ActionGroupProps & {
  name: string;
  save?: () => void;
  saveText?: string;
  reset?: () => void;
  resetText?: string;
  isSubmit?: boolean;
  isDisabled?: boolean;
};

export const FixedButtonsGroup = ({
  name,
  save,
  saveText,
  reset,
  resetText,
  isSubmit = false,
  isDisabled = false,
  children,
  ...rest
}: FixedButtonGroupProps) => {
  const { t } = useTranslation();
  return (
    <ActionGroup className={style.buttonGroup} {...rest}>
      {(save || isSubmit) && (
        <Button
          isDisabled={isDisabled}
          data-testid={`${name}-save`}
          onClick={() => save?.()}
          type={isSubmit ? "submit" : "button"}
        >
          {!saveText ? t("save") : saveText}
        </Button>
      )}
      {reset && (
        <Button
          isDisabled={isDisabled}
          data-testid={`${name}-revert`}
          variant="link"
          onClick={() => reset()}
        >
          {!resetText ? t("revert") : resetText}
        </Button>
      )}
      {children}
    </ActionGroup>
  );
};
