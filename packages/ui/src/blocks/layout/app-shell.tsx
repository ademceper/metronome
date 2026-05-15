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
    <SidebarProvider {...providerProps}>
      {sidebarNode}
      <SidebarInset className={cn(className)}>{children}</SidebarInset>
    </SidebarProvider>
  )
}
