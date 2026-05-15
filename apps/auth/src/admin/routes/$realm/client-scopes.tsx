import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/client-scopes")({
  component: () => <Outlet />,
})
