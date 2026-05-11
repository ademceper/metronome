/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/FormTitle.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { cn } from "@metronome/ui/lib/utils";
import style from "./form-title.module.css";


const TitleSizes = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;
const Title = ({ headingLevel = "h1", size, children, className, ...props }: any) =>
  React.createElement(headingLevel, {
    className: cn("font-heading font-medium", (TitleSizes as any)[size as string] ?? "text-base", className),
    ...props,
  }, children);
type TitleProps = React.ComponentProps<typeof Title>;

type FormTitleProps = Omit<TitleProps, "headingLevel"> & {
  id?: string;
  title: string;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const FormTitle = ({
  id,
  title,
  headingLevel = "h1",
  size = "xl",
  ...rest
}: FormTitleProps) => (
  <Title
    headingLevel={headingLevel}
    size={size}
    className={style.title}
    id={id}
    tabIndex={0} // so that jumpLink sends focus to the section for a11y
    {...rest}
  >
    {title}
  </Title>
);
