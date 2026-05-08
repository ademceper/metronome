import { Button } from "@metronome/ui/components/button"
import { Input } from "@metronome/ui/components/input"
import { Label } from "@metronome/ui/components/label"
import { cn } from "@metronome/ui/lib/utils"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import { kcSanitize } from "keycloakify/lib/kcSanitize"
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed"
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react"
import { forwardRef } from "react"

export function KcFieldError(props: { message?: string; id?: string }) {
  const { message, id } = props
  if (!message) return null
  return (
    <p
      id={id ?? "input-error"}
      className="text-destructive text-sm"
      aria-live="polite"
      dangerouslySetInnerHTML={{ __html: kcSanitize(message) }}
    />
  )
}

type KcFieldProps = {
  id: string
  label: ReactNode
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function KcField(props: KcFieldProps) {
  const { id, label, error, required, children, className } = props
  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative">
        {children}
        <Label
          htmlFor={id}
          className="pointer-events-none absolute top-1 left-4 z-10 text-muted-foreground text-xs transition-[top,font-size,color] duration-150 ease-out peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-foreground peer-focus:text-xs"
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      </div>
      <KcFieldError message={error} id={`${id}-error`} />
    </div>
  )
}

type KcTextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export const KcTextInput = forwardRef<HTMLInputElement, KcTextInputProps>(
  function KcTextInput(
    { invalid, className, placeholder = " ", ...rest },
    ref
  ) {
    return (
      <Input
        ref={ref}
        placeholder={placeholder}
        aria-invalid={invalid ?? undefined}
        className={cn(
          "peer h-12 pt-5 pb-1 pl-4 placeholder:text-transparent focus-visible:ring-0 aria-invalid:ring-0",
          invalid && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...rest}
      />
    )
  }
)

type KcPasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
  showLabel: string
  hideLabel: string
}

export function KcPasswordInput(props: KcPasswordInputProps) {
  const {
    id,
    invalid,
    className,
    showLabel,
    hideLabel,
    placeholder = " ",
    ...rest
  } = props

  if (!id) {
    throw new Error("KcPasswordInput requires an id")
  }

  const { isPasswordRevealed, toggleIsPasswordRevealed } =
    useIsPasswordRevealed({ passwordInputId: id })

  return (
    <>
      <Input
        id={id}
        type="password"
        placeholder={placeholder}
        aria-invalid={invalid ?? undefined}
        className={cn(
          "peer h-12 pt-5 pr-12 pb-1 pl-4 placeholder:text-transparent focus-visible:ring-0 aria-invalid:ring-0",
          invalid && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...rest}
      />
      <button
        type="button"
        aria-label={isPasswordRevealed ? hideLabel : showLabel}
        aria-controls={id}
        onClick={toggleIsPasswordRevealed}
        className="absolute inset-y-0 right-0 z-10 flex items-center px-4 text-muted-foreground hover:text-foreground"
      >
        {isPasswordRevealed ? (
          <EyeSlash className="size-5" aria-hidden />
        ) : (
          <Eye className="size-5" aria-hidden />
        )}
      </button>
    </>
  )
}

type KcSubmitProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
}

export function KcSubmit({ label, className, ...rest }: KcSubmitProps) {
  return (
    <Button
      type="submit"
      size="xl"
      className={cn("w-full", className)}
      {...rest}
    >
      {label}
    </Button>
  )
}
