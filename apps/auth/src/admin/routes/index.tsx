// @ts-nocheck
import { createFileRoute, Navigate } from "@tanstack/react-router"
import { useRealm } from "../context/realm-context/realm-context"

// Bare `/` has no realm of its own — hop into the active realm's welcome
// page so the dashboard logic only lives in `routes/$realm/index.tsx`.
function RootRedirect() {
  const { realm } = useRealm()
  return <Navigate to="/$realm" params={{ realm }} replace />
}

export const Route = createFileRoute("/")({
  component: RootRedirect,
})
