"use client"

import { UserButton } from "@/lib/auth"

export function AppHeader() {
  return (
    <header className="flex h-12 items-center justify-end gap-2 border-b px-4">
      <UserButton />
    </header>
  )
}
