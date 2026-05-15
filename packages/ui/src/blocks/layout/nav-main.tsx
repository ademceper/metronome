"use client"

import type { LinkComponent } from "@metronome/ui/blocks/layout/-link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@metronome/ui/components/collapsible"
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@metronome/ui/components/sidebar"
import { CaretRightIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

export type NavMainSubItem = {
  title: ReactNode
  href: string
  testId?: string
}

export type NavMainItem = {
  title: ReactNode
  href: string
  icon?: ReactNode
  /** When provided, the item renders a chevron action that toggles a
   *  submenu beneath it. The main button still navigates to `href`. */
  items?: NavMainSubItem[]
  /** Pre-expand the submenu by default. */
  defaultOpen?: boolean
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

export function NavMain({
  items,
  Link = DefaultLink,
}: {
  items: NavMainItem[]
  Link?: LinkComponent
}) {
  return (
    <SidebarMenu>
      {items.map((item, i) => {
        const hasChildren = !!item.items?.length
        const button = (
          <SidebarMenuButton
            asChild
            tooltip={typeof item.title === "string" ? item.title : undefined}
          >
            <Link href={item.href} data-testid={item.testId}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        )

        if (!hasChildren) {
          return <SidebarMenuItem key={i}>{button}</SidebarMenuItem>
        }

        return (
          <Collapsible
            key={i}
            asChild
            defaultOpen={item.defaultOpen}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {button}
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="data-[state=open]:rotate-90">
                  <CaretRightIcon />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((sub, j) => (
                    <SidebarMenuSubItem key={j}>
                      <SidebarMenuSubButton asChild>
                        <Link href={sub.href} data-testid={sub.testId}>
                          <span>{sub.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        )
      })}
    </SidebarMenu>
  )
}
