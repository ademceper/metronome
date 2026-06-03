/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/PreviewWindow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { Header } from "../../page-header";
import { Tabs, Tab, TabTitleText } from "../../../../shared/pf-compat"


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
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
const Page = ({ children, className, ...props }: any) => (
  <div className={cn("flex min-h-svh flex-col", className)} {...props}>{children}</div>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

type PreviewWindowProps = {
  cssVars: Record<string, string>;
};

export const PreviewWindow = ({ cssVars }: PreviewWindowProps) => (
  <>
    <style>{`
      .preview {
        ${Object.entries(cssVars)
          .map(([key, value]) => `--pf-v5-global--${key}: ${value};`)
          .join("\n")}
      }
    `}</style>
    <Page className="preview" header={<Header />}>
      <PageSection
        variant="light"
        style={{
          backgroundColor: cssVars["BackgroundColor--light-100"],
        }}
      >
        <Tabs activeKey={1} className="pf-v5-u-p-lg">
          <Tab eventKey={0} title={<TabTitleText>Tab One</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>Tab Two</TabTitleText>} />
        </Tabs>
        <Alert title="Error" isInline variant="danger" />
        <Alert title="Success" isInline variant="success" />
        <p className="pf-v5-u-p-lg pf-v5-c-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <Form>
          <TextInput id="test" placeholder="Text input" />
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="link">Link button</Button>
        </Form>
      </PageSection>
    </Page>
  </>
);
