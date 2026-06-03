// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/clients/$clientId/client-scopes/dedicated")({
  component: () => <Outlet />,
})
