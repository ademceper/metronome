/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/FormErrorText.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { cn } from "@metronome/ui/lib/utils";
import { WarningCircle as ExclamationCircleIcon } from "@phosphor-icons/react"


const FormHelperText = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-xs", className)} {...props}>{children}</div>
);
const HelperText = ({ children, className, ...props }: any) => (
  <div className={cn("text-sm text-muted-foreground", className)} {...props}>{children}</div>
);
const HelperTextItem = ({ icon, variant, children, ...props }: any) => (
  <p className={cn("text-sm",
    variant === "error" ? "text-destructive" : variant === "warning" ? "text-amber-600" : "text-muted-foreground",
    (props as any).className)} {...props}>
    {icon}{children}
  </p>
);
type FormHelperTextProps = React.ComponentProps<typeof FormHelperText>;

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
