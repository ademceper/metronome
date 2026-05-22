"use client"

import { cn } from "@metronome/ui/lib/utils"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const inputVariants = cva(
  "w-full min-w-0 rounded-lg border border-input bg-transparent outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:border-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:disabled:bg-input/80",
  {
    variants: {
      variant: {
        default: "h-8 px-2.5 py-1 text-base md:text-sm",
        floating:
          "peer h-12 px-3 pt-5 pb-1 text-base placeholder:text-transparent md:text-sm",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

type InputProps = Omit<React.ComponentProps<"input">, "type"> &
  VariantProps<typeof inputVariants> & {
    type?: React.HTMLInputTypeAttribute
    label?: React.ReactNode
    /** Aria label for the "show password" toggle (only when type="password"). */
    showLabel?: React.ReactNode
    /** Aria label for the "hide password" toggle (only when type="password"). */
    hideLabel?: React.ReactNode
  }

function Input({
  className,
  type = "text",
  variant,
  label,
  id,
  showLabel = "Show password",
  hideLabel = "Hide password",
  ...props
}: InputProps) {
  const reactId = React.useId()
  const inputId = id ?? reactId
  const isPassword = type === "password"
  const isFloating = variant === "floating"
  const [revealed, setRevealed] = React.useState(false)

  const inputEl = (
    <input
      type={isPassword ? (revealed ? "text" : "password") : type}
      id={inputId}
      data-slot="input"
      {...props}
      placeholder={isFloating ? " " : props.placeholder}
      className={cn(
        inputVariants({ variant }),
        isPassword && "pr-10",
        className
      )}
    />
  )

  if (!isFloating && !isPassword) {
    return inputEl
  }

  const toggleLabel = revealed ? hideLabel : showLabel

  return (
    <div className="relative">
      {inputEl}
      {isFloating && label !== undefined && (
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute top-0 left-3 origin-top-left translate-y-1.5 will-change-transform text-muted-foreground text-xs transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] peer-placeholder-shown:translate-y-3.5 peer-placeholder-shown:scale-[1.333] peer-focus:translate-y-1.5 peer-focus:scale-100 peer-focus:text-foreground peer-disabled:opacity-50 peer-aria-invalid:text-destructive"
        >
          {label}
        </label>
      )}
      {isPassword && (
        <button
          type="button"
          aria-label={typeof toggleLabel === "string" ? toggleLabel : undefined}
          aria-controls={inputId}
          onClick={() => setRevealed((v) => !v)}
          className="absolute inset-y-0 right-0 z-10 flex items-center px-3 text-muted-foreground hover:text-foreground"
        >
          {revealed ? (
            <EyeSlash className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </button>
      )}
    </div>
  )
}

export { Input }
