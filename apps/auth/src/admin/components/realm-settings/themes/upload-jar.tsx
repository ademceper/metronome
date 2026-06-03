/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/UploadJar.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import JSZip from "jszip";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { ThemeRealmRepresentation } from "./quick-theme";


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

type UploadJarProps = {
  onUpload: (theme: ThemeRealmRepresentation) => void;
};

export const UploadJar = ({ onUpload }: UploadJarProps) => {
  const { t } = useTranslation();

  const triggerUpload = () => {
    const input = document.getElementById("jarUpload") as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const handleAcceptedFiles = async (files: ChangeEvent<HTMLInputElement>) => {
    const file = files.target.files?.[0];
    if (!file) {
      return;
    }

    const jsZip = new JSZip();
    const zipFile = await jsZip.loadAsync(file);
    const themeFile = await zipFile
      .file("theme-settings.json")
      ?.async("string");

    const theme = JSON.parse(themeFile || "{}");
    theme.bgimage = await zipFile.file(theme.bgimage)?.async("blob");
    theme.favicon = await zipFile.file(theme.favicon)?.async("blob");
    theme.logo = await zipFile.file(theme.logo)?.async("blob");
    onUpload(theme);
  };

  return (
    <>
      <input
        id="jarUpload"
        type="file"
        accept=".jar"
        style={{ display: "none" }}
        onChange={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}
      />
      <Button variant="secondary" onClick={triggerUpload}>
        {t("uploadGeneratedThemeJar")}
      </Button>
    </>
  );
};
