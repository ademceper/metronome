import { cn } from "@metronome/ui/lib/utils"
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react"

type LinkBaseProps = {
  className?: string
  children: ReactNode
}

type LinkAnchorProps = LinkBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    as?: "a"
    /** Hide the animated trailing arrow. Useful when rendering long URLs in
     *  tight contexts (table cells, badges) where the arrow visually clutters
     *  the layout. */
    hideArrow?: boolean
  }

type LinkButtonProps = LinkBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    as: "button"
    hideArrow?: boolean
  }

export type LinkProps = LinkAnchorProps | LinkButtonProps

const linkClass =
  "group relative inline-flex items-center before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.075em] before:w-full before:bg-current before:content-[''] before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:origin-left hover:before:scale-x-100"

const trailingArrow = (
  <svg
    className="mt-0 ml-[0.3em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
    fill="none"
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function Link(props: LinkProps) {
  if (props.as === "button") {
    const { as: _as, children, className, hideArrow, ...rest } = props
    return (
      <button
        type="button"
        className={cn(linkClass, "cursor-pointer bg-transparent", className)}
        {...rest}
      >
        {children}
        {hideArrow ? null : trailingArrow}
      </button>
    )
  }
  const { as: _as, children, className, hideArrow, ...rest } = props
  return (
    <a className={cn(linkClass, className)} {...rest}>
      {children}
      {hideArrow ? null : trailingArrow}
    </a>
  )
}
