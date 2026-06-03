// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/page-section/$provider-id")({
  component: () => <Outlet />,
})
