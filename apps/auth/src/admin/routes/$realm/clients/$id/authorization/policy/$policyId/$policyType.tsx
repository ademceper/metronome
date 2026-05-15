import { createFileRoute } from "@tanstack/react-router"
import PolicyDetails from "../../../../../../../clients/authorization/policy/PolicyDetails"

export const Route = createFileRoute("/$realm/clients/$id/authorization/policy/$policyId/$policyType")({
  component: PolicyDetails,
})
