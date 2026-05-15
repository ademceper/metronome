import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/realm-settings")({
  component: () => <Outlet />,
})
