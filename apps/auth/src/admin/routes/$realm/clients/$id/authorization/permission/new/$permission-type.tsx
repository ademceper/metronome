// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/clients/$id/authorization/permission/new/$permission-type")({
  component: () => <Outlet />,
})
