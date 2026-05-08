/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/table/ListEmptyState.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  ComponentType,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
} from "react";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
  ButtonVariant,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from "../../../@patternfly/react-core";
import { PlusCircle as PlusCircleIcon, MagnifyingGlass as SearchIcon } from "@phosphor-icons/react"
type SVGIconProps = React.SVGProps<SVGSVGElement>

export type Action = {
  text: string;
  type?: ButtonVariant;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export type ListEmptyStateProps = {
  message: string;
  instructions: ReactNode;
  primaryActionText?: string;
  onPrimaryAction?: MouseEventHandler<HTMLButtonElement>;
  hasIcon?: boolean;
  icon?: ComponentType<SVGIconProps>;
  isSearchVariant?: boolean;
  secondaryActions?: Action[];
  isDisabled?: boolean;
};

export const ListEmptyState = ({
  message,
  instructions,
  onPrimaryAction,
  hasIcon = true,
  isSearchVariant,
  primaryActionText,
  secondaryActions,
  icon,
  isDisabled = false,
  children,
}: PropsWithChildren<ListEmptyStateProps>) => {
  return (
    <EmptyState data-testid="empty-state" variant="lg">
      {hasIcon && isSearchVariant ? (
        <EmptyStateIcon icon={SearchIcon} />
      ) : (
        hasIcon && <EmptyStateIcon icon={icon ? icon : PlusCircleIcon} />
      )}
      <EmptyStateHeader titleText={message} headingLevel="h1" />
      <EmptyStateBody>{instructions}</EmptyStateBody>
      <EmptyStateFooter>
        {primaryActionText && (
          <Button
            data-testid={`${message
              .replace(/\W+/g, "-")
              .toLowerCase()}-empty-action`}
            variant="primary"
            onClick={onPrimaryAction}
            isDisabled={isDisabled}
          >
            {primaryActionText}
          </Button>
        )}
        {children}
        {secondaryActions && (
          <EmptyStateActions>
            {secondaryActions.map((action) => (
              <Button
                key={action.text}
                data-testid={`${action.text
                  .replace(/\W+/g, "-")
                  .toLowerCase()}-empty-action`}
                variant={action.type || ButtonVariant.secondary}
                onClick={action.onClick}
                isDisabled={isDisabled}
              >
                {action.text}
              </Button>
            ))}
          </EmptyStateActions>
        )}
      </EmptyStateFooter>
    </EmptyState>
  );
};
