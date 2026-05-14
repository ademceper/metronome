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
import { SignOutIcon, UserCircleIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"

// Inline theme-aware default avatar. Uses CSS theme tokens so the same
// markup adapts to light and dark mode without swapping assets.
function DefaultAvatar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className={cn("size-full text-muted-foreground", className)}
    >
      <rect width="32" height="32" rx="16" className="fill-muted" />
      <g clipPath="url(#default-avatar-clip)">
        <ellipse
          cx="16"
          cy="31.2"
          rx="12.8"
          ry="9.6"
          fill="currentColor"
          fillOpacity="0.72"
        />
        <circle
          cx="16"
          cy="12.8"
          r="6.4"
          fill="currentColor"
          fillOpacity="0.9"
        />
      </g>
      <defs>
        <clipPath id="default-avatar-clip">
          <rect width="32" height="32" rx="16" />
        </clipPath>
      </defs>
    </svg>
  )
}

export type ProfileProps = {
  name?: string
  email?: string
  avatarUrl?: string
  onSignOut: () => void
  signOutLabel?: string
  /** URL to the identity provider's account/profile console. When set,
   *  the dropdown shows an "Account" item above Sign Out that opens this
   *  URL in a new tab. */
  accountUrl?: string
  accountLabel?: string
  /** Fallback when no avatarUrl is supplied. Defaults to /images/avatar.svg
   *  so apps that drop a static asset there (notification, user, admin)
   *  get a photo-style avatar instead of initials. */
  fallbackAvatarUrl?: string
  /** Extra DropdownMenuItem(s) inserted between the header and Sign Out. */
  children?: ReactNode
  align?: "start" | "center" | "end"
  className?: string
}

export function Profile({
  name,
  email,
  avatarUrl,
  fallbackAvatarUrl = "/images/avatar.svg",
  accountUrl,
  accountLabel = "Manage account",
  onSignOut,
  signOutLabel = "Sign out",
  children,
  align = "end",
  className,
}: ProfileProps) {
  const displayName = name || email || "Account"
  const initials = (displayName || "?").slice(0, 2).toUpperCase()
  // Only use the bitmap fallback when the caller explicitly overrode it.
  // Default path renders DefaultAvatar so it tracks the theme.
  const explicitFallback = fallbackAvatarUrl !== "/images/avatar.svg"
  const resolvedAvatar =
    avatarUrl ?? (explicitFallback ? fallbackAvatarUrl : undefined)
  const useDefaultAvatar = !resolvedAvatar

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
            {useDefaultAvatar ? (
              <DefaultAvatar />
            ) : (
              <AvatarImage src={resolvedAvatar} alt={displayName} />
            )}
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
              {useDefaultAvatar ? (
                <DefaultAvatar />
              ) : (
                <AvatarImage src={resolvedAvatar} alt={displayName} />
              )}
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
          {accountUrl ? (
            <DropdownMenuItem
              onSelect={() =>
                window.open(accountUrl, "_blank", "noopener,noreferrer")
              }
              className="flex cursor-pointer items-center gap-2 text-foreground focus:bg-accent focus:text-accent-foreground"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <UserCircleIcon className="size-3.5 shrink-0 text-muted-foreground" />
                <span>{accountLabel}</span>
              </div>
            </DropdownMenuItem>
          ) : null}
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
