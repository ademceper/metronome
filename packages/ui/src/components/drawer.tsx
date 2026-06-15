"use client"

import { useIsMobile } from "@metronome/ui/hooks/use-mobile"
import { cn } from "@metronome/ui/lib/utils"
import { XIcon } from "@phosphor-icons/react"
import type * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

function Drawer({
  direction,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  // Responsive default: bottom-sheet on touch / narrow viewports, side
  // drawer on desktop. Consumers can override by passing `direction`.
  const isMobile = useIsMobile()
  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      direction={direction ?? (isMobile ? "bottom" : "right")}
      {...props}
    />
  )
}

function DrawerTrigger(
  props: React.ComponentProps<typeof DrawerPrimitive.Trigger>
) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal(
  props: React.ComponentProps<typeof DrawerPrimitive.Portal>
) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose(
  props: React.ComponentProps<typeof DrawerPrimitive.Close>
) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  style,
  ...props
}: Omit<React.ComponentProps<typeof DrawerPrimitive.Content>, "children"> & {
  children?: React.ReactNode
}) {
  const isMobile = useIsMobile()

  if (!isMobile) {
    // Side drawer — floats 0.5rem inside the viewport edges. The enlarged
    // `--initial-transform` slides the panel fully off-screen past that
    // gap so the close animation completes cleanly (vaul side-drawer
    // example).
    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
          data-slot="drawer-content"
          style={
            {
              "--initial-transform": "calc(100% + 0.5rem)",
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "fixed end-2 top-2 bottom-2 z-50 flex w-[calc(100%-1rem)] outline-none sm:max-w-md",
            className
          )}
          {...props}
        >
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground text-sm shadow-xl">
            <DrawerPrimitive.Close
              aria-label="Close"
              className="absolute end-3 top-3 z-10 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
            >
              <XIcon size={16} aria-hidden="true" />
            </DrawerPrimitive.Close>
            {children}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPortal>
    )
  }

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        style={style}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[80vh] flex-col rounded-t-xl border bg-popover text-popover-foreground text-sm shadow-xl outline-none",
          className
        )}
        {...props}
      >
        <DrawerPrimitive.Handle className="mx-auto mt-4 h-1 w-[100px] shrink-0 rounded-full bg-muted" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "font-heading font-medium text-base text-foreground",
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
