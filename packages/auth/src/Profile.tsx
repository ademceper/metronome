import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@metronome/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  /** Extra DropdownMenuItem(s) inserted above the standard Sign Out item. */
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
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={displayName}
        className={cn(
          "rounded-full outline-none ring-offset-background transition-shadow",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        <Avatar className="size-8">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="text-sm">{displayName}</div>
          {email && name ? (
            <div className="text-muted-foreground text-xs">{email}</div>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children}
        {children ? <DropdownMenuSeparator /> : null}
        <DropdownMenuItem onSelect={onSignOut}>
          <SignOutIcon />
          {signOutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
