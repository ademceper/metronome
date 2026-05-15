import { createFileRoute } from "@tanstack/react-router"
import NewClientPolicy from "../../../../../realm-settings/NewClientPolicy"

export const Route = createFileRoute("/$realm/realm-settings/client-policies/$policyName/edit-policy")({
  component: NewClientPolicy,
})
