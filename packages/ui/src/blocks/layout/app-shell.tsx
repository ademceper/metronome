"use client"

import {
  AppSidebar,
  type AppSidebarProps,
} from "@metronome/ui/blocks/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@metronome/ui/components/sidebar"
import { cn } from "@metronome/ui/lib/utils"
import type { ComponentProps, ReactNode } from "react"

export type AppShellProps = {
  /** Sidebar content. Most callers pass an `<AppSidebar … />`; the prop is
   *  open-ended so apps that need a fully custom sidebar can swap it. */
  sidebar?: ReactNode
  /** Shortcut: pass AppSidebar props directly and AppShell renders it. Use
   *  either `sidebar` or these props, not both. */
  sidebarProps?: AppSidebarProps
  /** Main content. Rendered inside SidebarInset so it picks up the rounded
   *  inset styling. */
  children: ReactNode
  /** Props passed through to the SidebarProvider (e.g. defaultOpen). */
  providerProps?: ComponentProps<typeof SidebarProvider>
  /** Optional className applied to SidebarInset. */
  className?: string
}

/**
 * Top-level layout block. Wraps SidebarProvider + a sidebar + SidebarInset
 * in one piece so every consuming app gets the same chrome (rounded inset
 * panel on desktop, slide-over on mobile, consistent peer-data classes).
 *
 *   <AppShell sidebarProps={{ brand, groups, Link }}>
 *     {routeOutlet}
 *   </AppShell>
 */
export function AppShell({
  sidebar,
  sidebarProps,
  children,
  providerProps,
  className,
}: AppShellProps) {
  const sidebarNode =
    sidebar ?? (sidebarProps ? <AppSidebar {...sidebarProps} /> : null)
  return (
    // Cap the sidebar wrapper at the viewport so scroll happens INSIDE the
    // inset (the main page) rather than the outer body. shadcn's default
    // `min-h-svh` lets long content push the page taller and the whole
    // window scrolls — the sidebar drifts off with it. h-svh + overflow-
    // hidden caps the wrapper; SidebarInset is already flex-1 with m-2 from
    // the inset variant, so adding overflow-y-auto + min-h-0 lets the inset
    // fill the available height (margins preserved on all four sides) and
    // scroll internally when content overflows.
    <SidebarProvider
      {...providerProps}
      className={cn("h-svh overflow-hidden", providerProps?.className)}
    >
      {sidebarNode}
      <SidebarInset
        className={cn(
          // min-h-0 lets a flex child shrink past its content; overflow-y-auto
          // gives the inset its own scroll surface when content overflows;
          // overscroll-none stops the browser's rubber-band/bounce when the
          // scroll bottoms out, so no phantom gap at the edges.
          "min-h-0 overflow-y-auto overscroll-none",
          className
        )}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
