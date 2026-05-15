// react-router-dom v6 compatibility shim backed by @tanstack/react-router.
//
// The Keycloak admin theme under src/admin/ is vendored from
// @keycloakify/keycloak-admin-ui and ~241 files still import from
// react-router-dom. A vite + tsconfig alias rewrites that specifier to this
// module so the vendor call sites keep their existing signatures while
// KcAdminUi.tsx switches to TanStack file-based routing.

import {
  Link as TLink,
  Navigate as TNavigate,
  Outlet,
  useLocation as tUseLocation,
  useMatches as tUseMatches,
  useNavigate as tUseNavigate,
  useParams as tUseParams,
  useRouter as tUseRouter,
} from "@tanstack/react-router"
import type { ComponentType } from "react"
import {
  type AnchorHTMLAttributes,
  forwardRef,
  type FormHTMLAttributes,
  type ReactElement,
  type ReactNode,
  useCallback,
  useMemo,
} from "react"

export { Outlet }

// ─── Path/route type stubs (vendor type annotations only) ──────────────────

export type Path = { pathname: string; search: string; hash: string }
export type To = string | Partial<Path>
export type PathParam<S extends string> = string
export type NonIndexRouteObject = {
  path?: string
  element?: ReactNode
  children?: NonIndexRouteObject[]
  errorElement?: ReactNode
  handle?: unknown
}
export type RouteObject = NonIndexRouteObject & {
  index?: boolean
}

// ─── Navigation ────────────────────────────────────────────────────────────

type NavigateOptions = {
  replace?: boolean
  state?: unknown
  relative?: "route" | "path"
  preventScrollReset?: boolean
}

/**
 * useNavigate(): RR v6 returns a function navigate(to, opts). TanStack uses
 * an options object; translate.
 */
export function useNavigate() {
  const navigate = tUseNavigate()
  const router = tUseRouter()
  return useCallback(
    (to: To | number, opts?: NavigateOptions) => {
      if (typeof to === "number") {
        router.history.go(to)
        return
      }
      if (typeof to === "string") {
        navigate({
          to,
          replace: opts?.replace,
          state: opts?.state as never,
        })
        return
      }
      const path = `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`
      navigate({
        to: path,
        replace: opts?.replace,
        state: opts?.state as never,
      })
    },
    [navigate, router]
  )
}

// ─── Params ────────────────────────────────────────────────────────────────

export function useParams<
  T extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
>(): T {
  return tUseParams({ strict: false }) as unknown as T
}

// ─── Location ──────────────────────────────────────────────────────────────

type Location = {
  pathname: string
  search: string
  hash: string
  state: unknown
  key: string
}

export function useLocation(): Location {
  const loc = tUseLocation()
  const search = useMemo(() => {
    const raw = (loc.search ?? {}) as Record<string, unknown>
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(raw)) {
      if (value == null) continue
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, String(v))
      } else {
        params.set(key, String(value))
      }
    }
    const s = params.toString()
    return s ? `?${s}` : ""
  }, [loc.search])

  return {
    pathname: loc.pathname,
    search,
    hash: loc.hash ?? "",
    state: (loc as { state?: unknown }).state,
    key: (loc as { key?: string }).key ?? "default",
  }
}

// ─── Matches ───────────────────────────────────────────────────────────────

export function useMatch(pattern: string) {
  const matches = tUseMatches()
  const hit = matches.find(
    (m) => m.routeId === pattern || m.routeId.endsWith(pattern)
  )
  if (!hit) return null
  return {
    params: (hit as { params?: Record<string, string> }).params ?? {},
    pathname: (hit as { pathname?: string }).pathname ?? "",
    pathnameBase: (hit as { pathname?: string }).pathname ?? "",
    route: { path: hit.routeId },
  }
}

export function useMatches() {
  return tUseMatches()
}

// ─── useHref ───────────────────────────────────────────────────────────────

/**
 * useHref(to): RR computes the href the router would navigate to. We
 * approximate with prepending the (hash-router) base.
 */
export function useHref(to: To): string {
  if (typeof to === "string") return to
  return `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`
}

// ─── generatePath ──────────────────────────────────────────────────────────

/**
 * generatePath(path, params): RR substitutes :name placeholders. The vendor
 * code uses this to build links from route templates.
 */
export function generatePath(
  path: string,
  params: Record<string, string | number> = {}
): string {
  return path.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_, key) => {
    const v = params[key]
    return v == null ? "" : encodeURIComponent(String(v))
  })
}

// ─── Link ──────────────────────────────────────────────────────────────────

export type LinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  to: To
  replace?: boolean
  state?: unknown
  reloadDocument?: boolean
  relative?: "route" | "path"
  preventScrollReset?: boolean
  children?: ReactNode
}

function toString(to: To): string {
  if (typeof to === "string") return to
  return `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function CompatLink(
    {
      to,
      replace,
      state,
      reloadDocument,
      relative: _relative,
      preventScrollReset: _preventScrollReset,
      children,
      ...rest
    },
    ref
  ): ReactElement {
    const dest = toString(to)
    if (reloadDocument) {
      return (
        <a ref={ref} href={dest} {...rest}>
          {children}
        </a>
      )
    }
    return (
      <TLink
        ref={ref}
        to={dest as never}
        replace={replace}
        state={state as never}
        {...rest}
      >
        {children}
      </TLink>
    )
  }
)

// ─── NavLink ───────────────────────────────────────────────────────────────

type NavLinkRenderProps = { isActive: boolean; isPending: boolean }
type NavLinkProps = Omit<LinkProps, "children" | "className" | "style"> & {
  end?: boolean
  caseSensitive?: boolean
  children?: ReactNode | ((props: NavLinkRenderProps) => ReactNode)
  className?: string | ((props: NavLinkRenderProps) => string | undefined)
  style?:
    | React.CSSProperties
    | ((props: NavLinkRenderProps) => React.CSSProperties | undefined)
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function CompatNavLink(
    {
      to,
      end,
      caseSensitive: _caseSensitive,
      className,
      style,
      children,
      replace,
      state,
      reloadDocument,
      relative: _relative,
      preventScrollReset: _preventScrollReset,
      ...rest
    },
    ref
  ): ReactElement {
    const loc = tUseLocation()
    const dest = toString(to)
    const isActive = end
      ? loc.pathname === dest
      : loc.pathname.startsWith(dest)
    const renderProps: NavLinkRenderProps = { isActive, isPending: false }
    const resolvedClassName =
      typeof className === "function" ? className(renderProps) : className
    const resolvedStyle =
      typeof style === "function" ? style(renderProps) : style
    const resolvedChildren =
      typeof children === "function" ? children(renderProps) : children

    if (reloadDocument) {
      return (
        <a
          ref={ref}
          href={dest}
          className={resolvedClassName}
          style={resolvedStyle}
          {...rest}
        >
          {resolvedChildren}
        </a>
      )
    }
    return (
      <TLink
        ref={ref}
        to={dest as never}
        replace={replace}
        state={state as never}
        className={resolvedClassName}
        style={resolvedStyle}
        {...rest}
      >
        {resolvedChildren}
      </TLink>
    )
  }
)

// ─── Navigate ──────────────────────────────────────────────────────────────

export function Navigate({
  to,
  replace,
  state,
}: {
  to: To
  replace?: boolean
  state?: unknown
}) {
  return (
    <TNavigate
      to={toString(to) as never}
      replace={replace}
      state={state as never}
    />
  )
}

// ─── Form ──────────────────────────────────────────────────────────────────

/**
 * Form: RR v6's <Form> integrates with route actions/loaders. The admin
 * vendor uses it for one-off forms; we render a plain <form> since we
 * don't run actions through the router.
 */
export const Form = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement> & {
    method?: "get" | "post" | "put" | "delete" | "patch"
    action?: string
    encType?: string
    replace?: boolean
    reloadDocument?: boolean
  }
>(function CompatForm(props, ref) {
  const { replace: _r, reloadDocument: _rd, ...rest } = props
  return <form ref={ref} {...rest} />
})

// ─── matchPath / Route (used by use-react-router-breadcrumbs) ─────────────

type PathPattern = string | { path: string; end?: boolean; caseSensitive?: boolean }
type PathMatch = {
  params: Record<string, string | undefined>
  pathname: string
  pathnameBase: string
  pattern: { path: string; end: boolean; caseSensitive: boolean }
}

/**
 * matchPath compat: tests a pathname against a path pattern with optional
 * end + caseSensitive flags. Returns a PathMatch with params or null.
 * Mirrors the RR v6 shape exactly because use-react-router-breadcrumbs
 * indexes into match.params keyed on the segment names.
 */
export function matchPath(
  pattern: PathPattern,
  pathname: string
): PathMatch | null {
  const opts =
    typeof pattern === "string"
      ? { path: pattern, end: true, caseSensitive: false }
      : { end: true, caseSensitive: false, ...pattern }
  const paramNames: string[] = []
  let regexStr = opts.path
    .replace(/\/$/, "")
    .replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name)
      return "([^/]+)"
    })
    .replace(/\*$/, "(.*)")
  if (opts.end) regexStr += "/?$"
  const re = new RegExp(`^${regexStr}`, opts.caseSensitive ? "" : "i")
  const m = pathname.match(re)
  if (!m) return null
  const params: Record<string, string | undefined> = {}
  paramNames.forEach((name, i) => {
    params[name] = m[i + 1]
  })
  return {
    params,
    pathname: m[0],
    pathnameBase: m[0],
    pattern: opts,
  }
}

/**
 * Route is RR v6's element used inside <Routes>; the admin code never
 * renders <Route> directly, but type-only imports + tooling that walks
 * children expect the export. We expose a no-op component.
 */
export function Route(_props: {
  path?: string
  element?: ReactNode
  children?: ReactNode
}): ReactElement | null {
  return null
}

// ─── createHashRouter / RouterProvider stubs ──────────────────────────────

/**
 * createHashRouter / RouterProvider: KcAdminUi.tsx is the only call site;
 * we replace its body in this migration, so these are stubs that throw if
 * something else reaches for them at runtime.
 */
export function createHashRouter(_routes: RouteObject[]): unknown {
  throw new Error(
    "react-router-dom createHashRouter has been removed; admin uses TanStack file-based routing — see src/admin/routes/."
  )
}

export const RouterProvider: ComponentType<{ router: unknown }> =
  function CompatRouterProvider(): ReactElement {
    throw new Error(
      "react-router-dom RouterProvider has been removed; admin uses TanStack RouterProvider — see src/admin/KcAdminUi.tsx."
    )
  }
