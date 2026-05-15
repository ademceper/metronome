import { createFileRoute } from "@tanstack/react-router"
import PolicyDetails from "../../../../../../../clients/authorization/policy/PolicyDetails"

export const Route = createFileRoute("/$realm/clients/$id/authorization/policy/new/$policyType")({
  component: PolicyDetails,
})
