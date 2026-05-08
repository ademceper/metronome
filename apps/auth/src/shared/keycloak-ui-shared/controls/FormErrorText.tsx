/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/FormErrorText.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  FormHelperText,
  FormHelperTextProps,
  HelperText,
  HelperTextItem,
} from "../../@patternfly/react-core";
import { ExclamationCircleIcon } from "../../@patternfly/react-icons";

export type FormErrorTextProps = FormHelperTextProps & {
  message: string;
};

export const FormErrorText = ({ message, ...props }: FormErrorTextProps) => {
  return (
    <FormHelperText {...props}>
      <HelperText>
        <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
          {message}
        </HelperTextItem>
      </HelperText>
    </FormHelperText>
  );
};
