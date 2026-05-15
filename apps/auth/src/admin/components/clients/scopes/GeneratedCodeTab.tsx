/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/scopes/GeneratedCodeTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { Textarea as UITextarea } from "@metronome/ui/components/textarea";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { CopyToClipboardButton } from "../../copy-to-clipboard-button/CopyToClipboardButton";


const CodeBlock = ({ actions, children, ...props }: any) => (
  <div className="rounded-md border bg-muted/40">
    {actions ? <div className="flex justify-end px-2 py-1">{actions}</div> : null}
    <pre className={cn("overflow-auto rounded-md bg-muted p-3 text-sm", (props as any).className)} {...props}>{children}</pre>
  </div>
);
const CodeBlockAction = ({ children, className, ...props }: any) => (
  <div className={cn("inline-flex items-center", className)} {...props}>{children}</div>
);
const EmptyState = ({ variant, titleText, headingLevel, icon, children, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-3 py-10 text-center", (props as any).className)} {...props}>
    {icon ? <div className="text-muted-foreground">{React.createElement(icon)}</div> : null}
    {titleText ? <h3 className="font-medium text-lg">{titleText}</h3> : null}
    {children}
  </div>
);
const EmptyStateBody = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props}>{children}</div>
);
const EmptyStateHeader = ({ titleText, headingLevel = "h4", icon, children, ...props }: any) => (
  <div className="flex flex-col items-center gap-2" {...props}>
    {icon}
    {titleText ? React.createElement(headingLevel, { className: "font-medium text-base" }, titleText) : null}
    {children}
  </div>
);
const TextArea = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, ...props }: any) => (
  <UITextarea value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired} {...props} />
);

type GeneratedCodeTabProps = {
  user?: UserRepresentation;
  text: string;
  label: string;
};

export const GeneratedCodeTab = ({
  text,
  user,
  label,
}: GeneratedCodeTabProps) => {
  const { t } = useTranslation();

  return user ? (
    <CodeBlock
      id={label}
      actions={
        <CodeBlockAction>
          <CopyToClipboardButton id="code" text={text} label={label} />
        </CodeBlockAction>
      }
    >
      <TextArea
        id={`text-area-${label}`}
        rows={20}
        value={text}
        aria-label={label}
      />
    </CodeBlock>
  ) : (
    <EmptyState variant="lg" id={label}>
      <EmptyStateHeader titleText={<>{t(`${label}No`)}</>} headingLevel="h2" />
      <EmptyStateBody>{t(`${label}IsDisabled`)}</EmptyStateBody>
    </EmptyState>
  );
};
