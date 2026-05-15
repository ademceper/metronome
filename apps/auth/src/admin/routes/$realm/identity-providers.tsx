// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/identity-providers")({
  component: () => <Outlet />,
})
