"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@metronome/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@metronome/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@metronome/ui/components/sidebar"
import { CaretUpDownIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

export type NavUserProps = {
  name: ReactNode
  /** Secondary line under the name (e.g. email, realm). */
  description?: ReactNode
  /** Image URL. Falls back to initials drawn from `name`. */
  avatar?: string
  /** Optional dropdown menu items rendered when the trigger is clicked.
   *  Wrap with `<DropdownMenuItem>` etc. from `@metronome/ui/components/dropdown-menu`. */
  menu?: ReactNode
  /** Optional fallback initials override (defaults to first 2 chars of `name`). */
  initials?: string
}

function deriveInitials(name: ReactNode, override?: string): string {
  if (override) return override.slice(0, 2).toUpperCase()
  if (typeof name !== "string") return "?"
  return (name || "?").slice(0, 2).toUpperCase()
}

export function NavUser({
  name,
  description,
  avatar,
  menu,
  initials,
}: NavUserProps) {
  const { isMobile } = useSidebar()
  const fallback = deriveInitials(name, initials)

  const trigger = (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <Avatar className="h-8 w-8 rounded-lg">
        {avatar ? (
          <AvatarImage
            src={avatar}
            alt={typeof name === "string" ? name : ""}
          />
        ) : null}
        <AvatarFallback className="rounded-lg">{fallback}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        {description ? (
          <span className="truncate text-xs">{description}</span>
        ) : null}
      </div>
      <CaretUpDownIcon className="ms-auto size-4" />
    </SidebarMenuButton>
  )

  if (!menu) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>{trigger}</SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {avatar ? (
                    <AvatarImage
                      src={avatar}
                      alt={typeof name === "string" ? name : ""}
                    />
                  ) : null}
                  <AvatarFallback className="rounded-lg">
                    {fallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  {description ? (
                    <span className="truncate text-xs">{description}</span>
                  ) : null}
                </div>
              </div>
            </DropdownMenuLabel>
            {menu}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
