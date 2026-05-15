// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$realm/realm-settings/client-policies/$policyName/edit-policy")({
  component: () => <Outlet />,
})
