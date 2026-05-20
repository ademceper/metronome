"use client"

import { Input } from "@metronome/ui/components/input"
import { cn } from "@metronome/ui/lib/utils"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import {
  type ComponentProps,
  forwardRef,
  type ReactNode,
  useState,
} from "react"

export type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  /** Accessible label for the "show password" toggle (when hidden). */
  showLabel?: ReactNode
  /** Accessible label for the "hide password" toggle (when visible). */
  hideLabel?: ReactNode
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      className,
      showLabel = "Show password",
      hideLabel = "Hide password",
      ...rest
    },
    ref
  ) {
    const [revealed, setRevealed] = useState(false)
    const toggleLabel =
      typeof (revealed ? hideLabel : showLabel) === "string"
        ? revealed
          ? hideLabel
          : showLabel
        : undefined
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={revealed ? "text" : "password"}
          className={cn("pr-10", className)}
          {...rest}
        />
        <button
          type="button"
          aria-label={typeof toggleLabel === "string" ? toggleLabel : undefined}
          aria-controls={rest.id}
          onClick={() => setRevealed((v) => !v)}
          className="absolute inset-y-0 right-0 z-10 flex items-center px-3 text-muted-foreground hover:text-foreground"
        >
          {revealed ? (
            <EyeSlash className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </button>
      </div>
    )
  }
)
