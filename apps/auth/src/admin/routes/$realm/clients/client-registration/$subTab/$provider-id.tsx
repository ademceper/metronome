// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/clients/client-registration/$subTab/$provider-id")({
  component: () => <Outlet />,
})
