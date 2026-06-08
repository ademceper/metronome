/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/form/FormAccess.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type { AccessType } from "@keycloak/keycloak-admin-client/lib/defs/whoAmIRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { Textarea as UITextarea } from "@metronome/ui/components/textarea";
import { cn } from "@metronome/ui/lib/utils";
import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";
import { Controller } from "react-hook-form";

import { useAccess } from "../../context/access/access";
import { FixedButtonsGroup } from "./fixed-button-group";


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
const ClipboardCopy = ({ value, onChange, isReadOnly, isCode, hoverTip, clickTip, children, variant, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);
  const text = value ?? children ?? "";
  return (
    <div className="flex items-stretch gap-0">
      <UIInput readOnly={isReadOnly} value={String(text)}
        onChange={(e: any) => onChange?.(e, e.target.value)} className="rounded-r-none" />
      <UIButton type="button" variant="outline" className="rounded-l-none"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(String(text));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}>
        {copied ? (clickTip ?? "Copied") : (hoverTip ?? "Copy")}
      </UIButton>
    </div>
  );
};
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-5", (props as any).className)} {...props}>{children}</form>
);
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
const Stack = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const StackItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const TextArea = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, ...props }: any) => (
  <UITextarea value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired} {...props} />
);
type FormProps = React.ComponentProps<typeof Form>;

export type FormAccessProps = FormProps & {
  /**
   * One of the AccessType's that the user needs to have to view this form. Also see {@link useAccess}.
   * @type {AccessType}
   */
  role: AccessType;

  /**
   * An override property if fine grained access has been setup for this form.
   * @type {boolean}
   */
  fineGrainedAccess?: boolean;

  /**
   * Set unWrap when you don't want this component to wrap your "children" in a {@link Form} component.
   * @type {boolean}
   */
  unWrap?: boolean;

  /**
   * Overwrite the fineGrainedAccess and make form regardless of access rights.
   */
  isReadOnly?: boolean;
};

/**
 * Use this in place of a patternfly Form component and add the `role` and `fineGrainedAccess` properties.
 * @param {FormAccessProps} param0 - all properties of Form + role and fineGrainedAccess
 */
export const FormAccess = ({
  children,
  role,
  fineGrainedAccess = false,
  isReadOnly = false,
  unWrap = false,
  ...rest
}: PropsWithChildren<FormAccessProps>) => {
  const { hasAccess } = useAccess();

  const recursiveCloneChildren = (
    children: ReactNode,
    newProps: any,
  ): ReactNode => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      if (child.props) {
        const element = child as ReactElement;
        if (child.type === Controller) {
          return cloneElement(child, {
            ...element.props,
            render: (props: any) => {
              const renderElement = element.props.render(props);
              return cloneElement(renderElement, {
                ...renderElement.props,
                ...newProps,
              });
            },
          });
        }
        const children = recursiveCloneChildren(
          element.props.children,
          newProps,
        );
        switch (child.type) {
          case FixedButtonsGroup:
            return cloneElement(child, {
              isActive: !newProps.isDisabled,
              children,
            } as any);
          case TextArea:
            return cloneElement(child, {
              readOnly: newProps.isDisabled,
              children,
            } as any);
        }

        return cloneElement(
          child,
          child.type === FormGroup ||
            child.type === GridItem ||
            child.type === Grid ||
            child.type === ActionGroup ||
            child.type === ClipboardCopy ||
            child.type === Stack ||
            child.type === StackItem
            ? { children }
            : { ...newProps, children },
        );
      }
      return child;
    });
  };

  const isDisabled = isReadOnly || (!hasAccess(role) && !fineGrainedAccess);

  return (
    <>
      {!unWrap && (
        <Form {...rest} className={"keycloak__form " + (rest.className || "")}>
          {recursiveCloneChildren(children, isDisabled ? { isDisabled } : {})}
        </Form>
      )}
      {unWrap && (
        <div className="space-y-5">
          {recursiveCloneChildren(children, isDisabled ? { isDisabled } : {})}
        </div>
      )}
    </>
  );
};
