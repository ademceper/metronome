import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/authentication")({
  component: () => <Outlet />,
})
