import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@metronome/ui/components/avatar"
import { Button } from "@metronome/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@metronome/ui/components/dropdown-menu"
import { cn } from "@metronome/ui/lib/utils"
import { CaretDownIcon, SignOutIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

export type ProfileProps = {
  name?: string
  email?: string
  avatarUrl?: string
  showName?: boolean
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
  showName = true,
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
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("gap-2 px-2", className)}
          aria-label={displayName}
        >
          <Avatar className="size-7">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : null}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          {showName ? (
            <span className="hidden text-sm sm:inline">{displayName}</span>
          ) : null}
          <CaretDownIcon className="size-3.5 text-muted-foreground" />
        </Button>
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
