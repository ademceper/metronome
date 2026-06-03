"use client"

import { Button } from "@metronome/ui/components/button"
import { MagnifyingGlassIcon, PlusCircleIcon } from "@phosphor-icons/react"
import type {
  ComponentType,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
} from "react"

type SVGIconProps = React.SVGProps<SVGSVGElement>

export type ListEmptyStateAction = {
  text: string
  type?: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export type ListEmptyStateProps = {
  message: string
  instructions: ReactNode
  primaryActionText?: string
  onPrimaryAction?: MouseEventHandler<HTMLButtonElement>
  hasIcon?: boolean
  icon?: ComponentType<SVGIconProps>
  isSearchVariant?: boolean
  secondaryActions?: ListEmptyStateAction[]
  isDisabled?: boolean
}

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
  const Icon = isSearchVariant ? MagnifyingGlassIcon : (icon ?? PlusCircleIcon)
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center gap-3 p-12 text-center"
    >
      {hasIcon && (
        <div
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground"
        >
          <Icon size={24} />
        </div>
      )}
      <h3 className="font-semibold text-lg">{message}</h3>
      <p className="max-w-md text-muted-foreground text-sm">{instructions}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {primaryActionText && (
          <Button
            data-testid={`${message
              .replace(/\W+/g, "-")
              .toLowerCase()}-empty-action`}
            disabled={isDisabled}
            onClick={onPrimaryAction}
          >
            {primaryActionText}
          </Button>
        )}
        {children}
        {secondaryActions?.map((action) => (
          <Button
            key={action.text}
            data-testid={`${action.text
              .replace(/\W+/g, "-")
              .toLowerCase()}-empty-action`}
            disabled={isDisabled}
            onClick={action.onClick}
            variant="outline"
          >
            {action.text}
          </Button>
        ))}
      </div>
    </div>
  )
}
