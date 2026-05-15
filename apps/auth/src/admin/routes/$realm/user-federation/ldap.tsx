import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/user-federation/ldap")({
  component: () => <Outlet />,
})
