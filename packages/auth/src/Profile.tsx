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
  /** Extra DropdownMenuItem(s) inserted between header and Sign Out. */
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
            "h-6 w-6 rounded-full bg-white p-0 outline-none ring-0",
            "hover:bg-gray-50 focus:outline-hidden focus:ring-0 focus-visible:shadow-none",
            className
          )}
        >
          <Avatar className="h-6 w-6 border border-gray-200">
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
          className="w-[300px] border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center gap-3 p-3">
            <Avatar className="size-8 border border-gray-200">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="font-medium text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-gray-900 text-sm">
                {displayName}
              </div>
              {email && name ? (
                <div className="truncate text-gray-500 text-xs">{email}</div>
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
            className="flex cursor-pointer items-center gap-2 text-gray-700 hover:bg-gray-50"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <SignOutIcon className="h-3.5 w-3.5 shrink-0 text-gray-500" />
              <span>{signOutLabel}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
