"use client"

import type { LinkComponent } from "@metronome/ui/blocks/-link"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@metronome/ui/components/sidebar"
import type { ComponentProps, ReactNode } from "react"

export type NavSecondaryItem = {
  title: ReactNode
  href: string
  icon?: ReactNode
  testId?: string
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

export function NavSecondary({
  items,
  Link = DefaultLink,
  ...props
}: {
  items: NavSecondaryItem[]
  Link?: LinkComponent
} & ComponentProps<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.href} data-testid={item.testId}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
