/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/JsonEditorTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import CodeEditor from "../../form/CodeEditor";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { prettyPrintJSON } from "../../../util";
import { useUserProfile } from "./UserProfileContext";


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
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
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export const JsonEditorTab = () => {
  const { config, save, isSaving } = useUserProfile();
  const { t } = useTranslation();
  const { addError } = useAlerts();
  const [code, setCode] = useState(prettyPrintJSON(config));

  function resetCode() {
    setCode(config ? prettyPrintJSON(config) : "");
  }

  async function handleSave() {
    const value = code;

    if (!value) {
      return;
    }

    try {
      await save(JSON.parse(value));
    } catch (error) {
      addError("invalidJsonError", error);
      return;
    }
  }

  return (
    <PageSection variant="light">
      <CodeEditor
        language="json"
        value={code}
        onChange={(value) => setCode(value ?? "")}
        height={480}
      />
      <Form>
        <ActionGroup>
          <Button
            data-testid="save"
            variant="primary"
            onClick={handleSave}
            isDisabled={isSaving}
          >
            {t("save")}
          </Button>
          <Button variant="link" onClick={resetCode} isDisabled={isSaving}>
            {t("revert")}
          </Button>
        </ActionGroup>
      </Form>
    </PageSection>
  );
};
