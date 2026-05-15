import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/realm-settings/client-policies/$profileName/edit-profile")({
  component: () => <Outlet />,
})
