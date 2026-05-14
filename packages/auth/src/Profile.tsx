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
      style={{ color: "var(--avatar-fg)" }}
      className={cn("size-full", className)}
    >
      <rect
        width="32"
        height="32"
        rx="16"
        style={{ fill: "var(--avatar-bg)" }}
      />
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
  /** Bitmap fallback when no avatarUrl is supplied. When omitted (the
   *  common case) the theme-aware inline DefaultAvatar SVG renders
   *  instead, adapting to light/dark mode. */
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
  fallbackAvatarUrl,
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
  // No explicit fallback ⇒ render the theme-aware inline SVG. Apps that
  // want a static bitmap can opt in by passing fallbackAvatarUrl.
  const resolvedAvatar = avatarUrl ?? fallbackAvatarUrl
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
            {resolvedAvatar ? (
              <AvatarImage src={resolvedAvatar} alt={displayName} />
            ) : null}
            <AvatarFallback
              delayMs={useDefaultAvatar ? 0 : undefined}
              className={cn(
                "font-medium text-[10px]",
                useDefaultAvatar && "bg-transparent p-0"
              )}
            >
              {useDefaultAvatar ? <DefaultAvatar /> : initials}
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
              {resolvedAvatar ? (
                <AvatarImage src={resolvedAvatar} alt={displayName} />
              ) : null}
              <AvatarFallback
                delayMs={useDefaultAvatar ? 0 : undefined}
                className={cn(
                  "font-medium text-xs",
                  useDefaultAvatar && "bg-transparent p-0"
                )}
              >
                {useDefaultAvatar ? <DefaultAvatar /> : initials}
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
