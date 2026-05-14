import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@metronome/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@metronome/ui/components/dropdown-menu"
import { cn } from "@metronome/ui/lib/utils"
import { SignOutIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

export type ProfileProps = {
  name?: string
  email?: string
  avatarUrl?: string
  onSignOut: () => void
  signOutLabel?: string
  /** Extra DropdownMenuItem(s) inserted between the header and Sign Out. */
  children?: ReactNode
  align?: "start" | "center" | "end"
  className?: string
}

export function Profile({
  name,
  email,
  avatarUrl,
  onSignOut,
  signOutLabel = "Sign out",
  children,
  align = "end",
  className,
}: ProfileProps) {
  const displayName = name || email || "Account"
  const initials = (displayName || "?").slice(0, 2).toUpperCase()

  return (
    <div className="shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={displayName}
          className={cn(
            "size-6 rounded-full bg-background p-0 outline-none ring-0",
            "hover:bg-accent focus:outline-hidden focus:ring-0 focus-visible:shadow-none",
            className
          )}
        >
          <Avatar className="size-6 border">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : null}
            <AvatarFallback className="font-medium text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          sideOffset={5}
          className="w-75 border bg-popover text-popover-foreground shadow-sm"
        >
          <div className="flex items-center gap-3 p-3">
            <Avatar className="size-8 border">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="font-medium text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-foreground text-sm">
                {displayName}
              </div>
              {email && name ? (
                <div className="truncate text-muted-foreground text-xs">
                  {email}
                </div>
              ) : null}
            </div>
          </div>
          {children ? (
            <>
              <DropdownMenuSeparator />
              {children}
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={onSignOut}
            className="flex cursor-pointer items-center gap-2 text-foreground focus:bg-accent focus:text-accent-foreground"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <SignOutIcon className="size-3.5 shrink-0 text-muted-foreground" />
              <span>{signOutLabel}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
