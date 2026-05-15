import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/clients/client-registration/$subTab")({
  component: () => <Outlet />,
})
