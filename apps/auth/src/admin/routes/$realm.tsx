// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router"

// Pathless layout for /$realm. Acts as the realm-scoped Outlet host so
// nested routes (/$realm/clients, /$realm/users, /$realm/$tab, ...) can
// render. The exact /$realm match is handled by $realm/index.tsx, which
// renders the Dashboard page.
export const Route = createFileRoute("/$realm")({
  component: () => <Outlet />,
})
