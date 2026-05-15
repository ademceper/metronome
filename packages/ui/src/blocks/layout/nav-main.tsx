"use client"

import type { LinkComponent } from "@metronome/ui/blocks/layout/-link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@metronome/ui/components/collapsible"
import {
  SidebarMenu,
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
  /** Where a LEAF item navigates. Items with `items` ignore this — they're
   *  pure submenu toggles, not links. */
  href?: string
  icon?: ReactNode
  /** Renders the parent button as a Collapsible trigger and lists these
   *  beneath it. Only the children are links; the parent just opens/closes. */
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
        const titleText =
          typeof item.title === "string" ? item.title : undefined

        // Leaf item: the whole button is a link.
        if (!hasChildren) {
          return (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton asChild tooltip={titleText}>
                <Link href={item.href ?? "#"} data-testid={item.testId}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        }

        // Parent of a submenu: the whole button is a toggle, NOT a link.
        // Clicking anywhere on it opens/closes the children. The chevron
        // lives at the trailing edge of the same button and rotates on open.
        return (
          <Collapsible
            key={i}
            asChild
            defaultOpen={item.defaultOpen}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={titleText}
                  data-testid={item.testId}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <CaretRightIcon className="ms-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
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
