/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/PasswordInput.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  Button,
  InputGroup,
  InputGroupItem,
  TextInput,
  type TextInputProps,
} from "../../@patternfly/react-core";
import { EyeIcon, EyeSlashIcon } from "../../@patternfly/react-icons";
import { MutableRefObject, Ref, forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type PasswordInputProps = TextInputProps & {
  hasReveal?: boolean;
};

const PasswordInputBase = ({
  hasReveal = true,
  innerRef,
  ...rest
}: PasswordInputProps) => {
  const { t } = useTranslation();
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput
          {...rest}
          type={hidePassword ? "password" : "text"}
          ref={innerRef}
        />
      </InputGroupItem>
      {hasReveal && (
        <Button
          variant="control"
          aria-label={t("showPassword")}
          onClick={() => setHidePassword(!hidePassword)}
        >
          {hidePassword ? <EyeIcon /> : <EyeSlashIcon />}
        </Button>
      )}
    </InputGroup>
  );
};

export const PasswordInput = forwardRef(
  (props: PasswordInputProps, ref: Ref<HTMLInputElement>) => (
    <PasswordInputBase {...props} innerRef={ref as MutableRefObject<any>} />
  ),
);
PasswordInput.displayName = "PasswordInput";
