/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/ScrollForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { cn } from "@metronome/ui/lib/utils";
import { Fragment, ReactNode, useMemo } from "react";
import { FormPanel } from "./FormPanel";
import { ScrollPanel } from "./ScrollPanel";

import style from "./scroll-form.module.css";


const Grid = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-2", className)} {...props}>{children}</div>
);
const GridItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const JumpLinks = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-1 text-sm", className)} {...props}>{children}</div>
);
const JumpLinksItem = ({ href, children, ...props }: any) => (
  <a href={href} className="text-sm hover:underline" {...props}>{children}</a>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
type GridProps = React.ComponentProps<typeof Grid>;

export const mainPageContentId = "kc-main-content-page-container";

type ScrollSection = {
  title: string;
  panel: ReactNode;
  isHidden?: boolean;
};

type ScrollFormProps = GridProps & {
  label: string;
  sections: ScrollSection[];
  borders?: boolean;
};

const spacesToHyphens = (string: string): string => {
  return string.replace(/\s+/g, "-");
};

export const ScrollForm = ({
  label,
  sections,
  borders = false,
  ...rest
}: ScrollFormProps) => {
  const shownSections = useMemo(
    () => sections.filter(({ isHidden }) => !isHidden),
    [sections],
  );

  return (
    <Grid hasGutter {...rest}>
      <GridItem md={8} sm={12}>
        {shownSections.map(({ title, panel }) => {
          const scrollId = spacesToHyphens(title.toLowerCase());

          return (
            <Fragment key={title}>
              {borders ? (
                <FormPanel
                  scrollId={scrollId}
                  title={title}
                  className={style.panel}
                >
                  {panel}
                </FormPanel>
              ) : (
                <ScrollPanel scrollId={scrollId} title={title}>
                  {panel}
                </ScrollPanel>
              )}
            </Fragment>
          );
        })}
      </GridItem>
      <GridItem md={4} sm={12} order={{ default: "-1", md: "1" }}>
        <PageSection className={style.sticky}>
          <JumpLinks
            isVertical
            // scrollableSelector has to point to the id of the element whose scrollTop changes
            // to scroll the entire main section, it has to be the pf-v5-c-page__main
            scrollableSelector={`#${mainPageContentId}`}
            label={label}
            offset={100}
          >
            {shownSections.map(({ title }) => {
              const scrollId = spacesToHyphens(title.toLowerCase());

              return (
                <JumpLinksItem
                  key={title}
                  onClick={() => {
                    const element = document.getElementById(scrollId);
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  data-testid={`jump-link-${scrollId}`}
                >
                  {title}
                </JumpLinksItem>
              );
            })}
          </JumpLinks>
        </PageSection>
      </GridItem>
    </Grid>
  );
};
