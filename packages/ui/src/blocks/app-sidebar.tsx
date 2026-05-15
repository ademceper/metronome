"use client"

import type { LinkComponent } from "@metronome/ui/blocks/-link"
import { NavMain, type NavMainItem } from "@metronome/ui/blocks/nav-main"
import { NavUser, type NavUserProps } from "@metronome/ui/blocks/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@metronome/ui/components/sidebar"
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
  /** Branding shown in the SidebarHeader. Provide either this OR `header`. */
  brand?: AppSidebarBrand
  /** Fully custom header content. Wins over `brand`. */
  header?: ReactNode
  /** Grouped nav items rendered in SidebarContent. Defaults to []. */
  groups?: SidebarNavGroup[]
  /** User card shown in SidebarFooter via NavUser. Provide either this
   *  OR `footer` (or neither — the footer is then omitted). */
  user?: NavUserProps
  /** Fully custom footer content. Wins over `user`. */
  footer?: ReactNode
  /** Router-aware link component. Receives `{ href, children, …rest }` and
   *  should render an anchor that triggers a client-side navigation. Defaults
   *  to a plain `<a>`. */
  Link?: LinkComponent
} & ComponentProps<typeof Sidebar>

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

export function AppSidebar({
  brand,
  header,
  groups = [],
  user,
  footer,
  Link = DefaultLink,
  ...sidebarProps
}: AppSidebarProps) {
  return (
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
      {footer || user ? (
        <SidebarFooter>
          {footer ?? (user ? <NavUser {...user} /> : null)}
        </SidebarFooter>
      ) : null}
    </Sidebar>
  )
}
