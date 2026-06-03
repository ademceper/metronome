// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/authentication/$id/$used-by")({
  component: () => <Outlet />,
})
