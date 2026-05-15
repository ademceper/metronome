"use client"

import type { LinkComponent } from "@metronome/ui/blocks/layout/-link"
import { NavMain, type NavMainItem } from "@metronome/ui/blocks/layout/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@metronome/ui/components/sidebar"
import { cn } from "@metronome/ui/lib/utils"
import type { ComponentProps, ComponentType, ReactNode } from "react"

export type SidebarNavGroup = {
  /** Optional label shown above the items (e.g. "Manage", "Configure"). */
  label?: ReactNode
  items: NavMainItem[]
}

export type AppSidebarBrand = {
  name: ReactNode
  description?: ReactNode
  icon?: ReactNode
  /** Where the brand header link points to. */
  href?: string
  /** Optional test id for the brand link. */
  testId?: string
}

export type AppSidebarProps = {
  /** Main content rendered inside SidebarInset. Pass the page outlet or
   *  layout. AppSidebar is the whole layout block — it renders the
   *  SidebarProvider + sidebar + inset all in one. */
  children?: ReactNode
  /** Branding shown in the SidebarHeader. Provide either this OR `header`. */
  brand?: AppSidebarBrand
  /** Fully custom header content. Wins over `brand`. */
  header?: ReactNode
  /** Grouped nav items rendered in SidebarContent. Defaults to []. */
  groups?: SidebarNavGroup[]
  /** Fully custom footer content. When omitted, no SidebarFooter is rendered. */
  footer?: ReactNode
  /** Router-aware link component. Receives `{ href, children, …rest }` and
   *  should render an anchor that triggers a client-side navigation. Defaults
   *  to a plain `<a>`. */
  Link?: LinkComponent
  /** Props forwarded to SidebarProvider (e.g. defaultOpen). */
  providerProps?: ComponentProps<typeof SidebarProvider>
  /** Props forwarded to the inner Sidebar (variant defaults to "inset"). */
  sidebarProps?: ComponentProps<typeof Sidebar>
  /** Optional className applied to the SidebarInset wrapper around children. */
  insetClassName?: string
}

function DefaultLink({
  href,
  children,
  ...rest
}: {
  href: string
  children: ReactNode
} & Record<string, unknown>) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}

const BrandHeader: ComponentType<{
  brand: AppSidebarBrand
  Link: LinkComponent
}> = ({ brand, Link }) => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" asChild>
        <Link href={brand.href ?? "/"} data-testid={brand.testId}>
          {brand.icon ? (
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {brand.icon}
            </div>
          ) : null}
          <div className="grid flex-1 text-start text-sm leading-tight">
            <span className="truncate font-medium">{brand.name}</span>
            {brand.description ? (
              <span className="truncate text-xs">{brand.description}</span>
            ) : null}
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
)

/**
 * Full app layout block: SidebarProvider + Sidebar (inset variant) +
 * SidebarInset, with sensible defaults so every consumer gets the same
 * rounded inset chrome and scroll behavior without having to compose the
 * pieces by hand.
 *
 *   <AppSidebar brand={…} groups={…} Link={…}>
 *     {pageOutlet}
 *   </AppSidebar>
 */
export function AppSidebar({
  children,
  brand,
  header,
  groups = [],
  footer,
  Link = DefaultLink,
  providerProps,
  sidebarProps,
  insetClassName,
}: AppSidebarProps) {
  return (
    // Pin the wrapper to the viewport so scroll happens INSIDE the inset
    // rather than the body. shadcn's default `min-h-svh` lets long pages
    // grow the document; that surfaces an outer scrollbar and the sidebar
    // drifts off with it. h-svh + overflow-hidden caps the wrapper.
    <SidebarProvider
      {...providerProps}
      className={cn("h-svh overflow-hidden", providerProps?.className)}
    >
      <Sidebar variant="inset" {...sidebarProps}>
        <SidebarHeader>
          {header ?? (brand ? <BrandHeader brand={brand} Link={Link} /> : null)}
        </SidebarHeader>
        <SidebarContent>
          {groups.map((group, i) => (
            <SidebarGroup key={i}>
              {group.label ? (
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              ) : null}
              <NavMain items={group.items} Link={Link} />
            </SidebarGroup>
          ))}
        </SidebarContent>
        {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
      </Sidebar>
      <SidebarInset
        className={cn(
          // min-h-0 lets the inset shrink past its content in the flex row;
          // overflow-y-auto gives it its own scroll surface; overscroll-none
          // kills the browser rubber-band so no phantom gap appears when
          // the user scrolls past the edge.
          "min-h-0 overflow-y-auto overscroll-none",
          insetClassName
        )}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
