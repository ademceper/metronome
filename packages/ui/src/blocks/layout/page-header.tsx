"use client"

import { cn } from "@metronome/ui/lib/utils"
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

export type PageHeaderMeta = {
  title?: ReactNode
  description?: ReactNode
  /** Trailing-edge slot for action buttons / filters. */
  actions?: ReactNode
}

type Ctx = {
  meta: PageHeaderMeta
  setMeta: (m: PageHeaderMeta) => void
}

const PageHeaderContext = createContext<Ctx | null>(null)

/**
 * Page-side hook. Call once per page (top of the component) with the
 * title + description you want shown in the inset's sticky header. The
 * value is cleared automatically on unmount, so navigating to a page
 * without a usePageHeader call hides the bar.
 */
export function usePageHeader({
  title,
  description,
  actions,
}: PageHeaderMeta): void {
  // Pull the stable `setMeta` reference out of the context value. The
  // context wrapper (`{ meta, setMeta }`) is re-memoised every time
  // `meta` changes, so depending on `ctx` here would re-fire the
  // effect on every `setMeta` call and infinite-loop. `setMeta` itself
  // is the `useState` dispatcher and is referentially stable.
  const setMeta = useContext(PageHeaderContext)?.setMeta
  useEffect(() => {
    if (!setMeta) return
    setMeta({ title, description, actions })
    return () => setMeta({})
  }, [setMeta, title, description, actions])
}

/**
 * Internal: renders the sticky bar in the inset. AppSidebar mounts this
 * once at the top of SidebarInset and supplies the surrounding Provider.
 */
export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<PageHeaderMeta>({})
  const value = useMemo<Ctx>(() => ({ meta, setMeta }), [meta])
  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  )
}

export type PageHeaderBarProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional left-aligned slot. Useful for the SidebarTrigger so the bar
   *  always renders even when a page hasn't called `usePageHeader`. */
  leading?: ReactNode
}

export function PageHeaderBar({
  className,
  leading,
  ...rest
}: PageHeaderBarProps) {
  const ctx = useContext(PageHeaderContext)
  const meta = ctx?.meta
  const hasMeta = !!meta && (meta.title || meta.description || meta.actions)
  if (!leading && !hasMeta) return null
  return (
    <div
      className={cn(
        "sticky top-0 z-20 flex h-11 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/75",
        className
      )}
      {...rest}
    >
      {leading ? (
        <div className="flex shrink-0 items-center">{leading}</div>
      ) : null}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {meta?.title ? (
          <div aria-hidden="true" className="h-4 w-px shrink-0 bg-border" />
        ) : null}
        {meta?.title ? (
          <h1 className="truncate font-medium text-base leading-tight">
            {meta.title}
          </h1>
        ) : null}
        {meta?.description ? (
          <p className="truncate text-muted-foreground text-xs">
            {meta.description}
          </p>
        ) : null}
      </div>
      {meta?.actions ? (
        <div className="flex shrink-0 items-center gap-2">{meta.actions}</div>
      ) : null}
    </div>
  )
}

/**
 * Imperative variant: drop `<PageHeader title description actions />` at the
 * top of any page to render an inline header without going through the
 * context (handy for one-off pages that don't need the sticky bar). For
 * the standard sidebar-inset header use `usePageHeader` instead.
 */
export type PageHeaderProps = PageHeaderMeta &
  Omit<HTMLAttributes<HTMLDivElement>, "title">

export function PageHeader({
  title,
  description,
  actions,
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b bg-background px-4 py-3",
        className
      )}
      {...rest}
    >
      <div className="min-w-0 flex-1">
        {title ? (
          <h1 className="truncate font-bold text-2xl leading-tight tracking-tight">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="mt-0.5 truncate text-muted-foreground text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
