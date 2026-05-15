import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/permissions/$permissionClientId/policies")({
  component: () => <Outlet />,
})
