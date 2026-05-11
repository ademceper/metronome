/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/scroll-form/FormPanel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Card as UICard, CardContent as UICardContent, CardHeader as UICardHeader, CardTitle as UICardTitle } from "@metronome/ui/components/card";
import { PropsWithChildren, useId } from "react";
import { FormTitle } from "./FormTitle";


const Card = ({ isSelectable, isSelected, isFlat, isCompact, ...props }: any) => (
  <UICard {...props} />
);
const CardBody = (props: any) => <UICardContent {...props} />;
const CardHeader = (props: any) => <UICardHeader {...props} />;
const CardTitle = (props: any) => <UICardTitle {...props} />;

type FormPanelProps = {
  title: string;
  scrollId?: string;
  className?: string;
};

export const FormPanel = ({
  title,
  children,
  scrollId,
  className,
}: PropsWithChildren<FormPanelProps>) => {
  const id = useId();

  return (
    <Card id={id} className={className} isFlat>
      <CardHeader className="kc-form-panel__header">
        <CardTitle tabIndex={0}>
          <FormTitle id={scrollId} title={title} />
        </CardTitle>
      </CardHeader>
      <CardBody className="kc-form-panel__body">{children}</CardBody>
    </Card>
  );
};
