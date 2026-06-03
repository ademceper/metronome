/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/DefaultColorAccordion.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Accordion as UIAccordion, AccordionContent as UIAccordionContent, AccordionItem as UIAccordionItem, AccordionTrigger as UIAccordionTrigger } from "@metronome/ui/components/accordion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { resolveColorToHex } from "./patternfly-vars";
import { ColorControl, ColorControlProps } from "./color-control";


const Accordion = ({ asDefinitionList, children, ...props }: any) => (
  <UIAccordion type="multiple" {...props}>{children}</UIAccordion>
);
const AccordionContent = ({ children, ...props }: any) => (
  <UIAccordionContent {...props}>{children}</UIAccordionContent>
);
const AccordionItem = ({ children, ...props }: any) => (
  <UIAccordionItem value={String((props as any).id ?? Math.random())} {...props}>{children}</UIAccordionItem>
);
const AccordionToggle = ({ onClick, isExpanded, children, ...props }: any) => (
  <UIAccordionTrigger onClick={onClick} {...props}>{children}</UIAccordionTrigger>
);

type DefaultColorAccordionProps = ColorControlProps & {
  colorName?: string;
  onOverride?: (colorName: string) => void;
};

export const DefaultColorAccordion = (props: DefaultColorAccordionProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const { color, colorName, onOverride, ...rest } = props;

  const handleOverride = () => {
    if (colorName && onOverride) {
      onOverride(colorName);
    }
  };

  return (
    <Accordion asDefinitionList={false} isBordered togglePosition="start">
      <AccordionItem>
        <AccordionToggle
          onClick={() => setExpanded(!expanded)}
          isExpanded={expanded}
          id="default-color-toggle"
        >
          {t(props.label || "defaultColor")}
        </AccordionToggle>
        <AccordionContent id="default-color-content" isHidden={!expanded}>
          <ColorControl
            {...rest}
            color={resolveColorToHex(color)}
            onUserChange={handleOverride}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
