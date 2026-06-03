/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/keycloak-card/ClickableCard.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { KeyboardEvent, useId } from "react";
import { Card as UICard, CardHeader as UICardHeader } from "@metronome/ui/components/card";

const Card = ({ isSelectable, isSelected, isFlat, isCompact, ...props }: any) => (
  <UICard {...props} />
);
const CardHeader = (props: any) => <UICardHeader {...props} />;
type CardProps = React.ComponentProps<typeof Card>;

type ClickableCardProps = Omit<CardProps, "onClick"> & {
  onClick: () => void;
};

export const ClickableCard = ({
  onClick,
  children,
  ...rest
}: ClickableCardProps) => {
  const id = useId();
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
      onClick();
    }
  };
  return (
    <Card id={id} isClickable onKeyDown={onKeyDown} onClick={onClick} {...rest}>
      <CardHeader
        selectableActions={{
          onClickAction: onClick,
          selectableActionId: `input-${id}`,
          selectableActionAriaLabelledby: id,
        }}
      >
        {children}
      </CardHeader>
    </Card>
  );
};
