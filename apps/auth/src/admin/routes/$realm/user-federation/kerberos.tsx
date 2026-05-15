// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/user-federation/kerberos")({
  component: () => <Outlet />,
})
