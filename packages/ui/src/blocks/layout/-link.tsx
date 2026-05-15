// Shared Link contract for the sidebar blocks. A `LinkComponent` accepts an
// `href` plus arbitrary props (className, data-*, aria-*, onClick, etc.) and
// renders an anchor that triggers client-side navigation.
//
// Defaults to a plain `<a>` for backend-less previews; apps typically pass a
// router-aware wrapper:
//   const Link = ({ href, ...rest }) => <NavLink to={href} {...rest} />
import type { ReactNode } from "react"

export type LinkComponentProps = {
  href: string
  children: ReactNode
} & Record<string, unknown>

export type LinkComponent = (props: LinkComponentProps) => ReactNode
