import { cn } from "@metronome/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const inputVariants = cva(
  "w-full min-w-0 rounded-lg border border-input bg-transparent outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
  {
    variants: {
      variant: {
        default: "h-8 px-2.5 py-1 text-base md:text-sm",
        floating:
          "peer h-14 px-3 pt-5 pb-1 text-base placeholder:text-transparent md:text-sm",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    label?: React.ReactNode
  }

function FloatingInput({
  className,
  type,
  label,
  id,
  ...props
}: Omit<InputProps, "variant">) {
  const reactId = React.useId()
  const inputId = id ?? reactId

  return (
    <div className="relative">
      <input
        type={type}
        id={inputId}
        data-slot="input"
        {...props}
        placeholder=" "
        className={cn(inputVariants({ variant: "floating" }), className)}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute top-1.5 left-3 text-muted-foreground text-xs transition-all duration-150 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-foreground peer-focus:text-xs peer-disabled:opacity-50 peer-aria-invalid:text-destructive"
      >
        {label}
      </label>
    </div>
  )
}

function Input({ className, type, variant, label, ...props }: InputProps) {
  if (variant === "floating") {
    return (
      <FloatingInput
        className={className}
        type={type}
        label={label}
        {...props}
      />
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      {...props}
      className={cn(inputVariants({ variant }), className)}
    />
  )
}

export { Input }
