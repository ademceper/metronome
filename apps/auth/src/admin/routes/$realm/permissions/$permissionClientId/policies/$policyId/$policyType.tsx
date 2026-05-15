import { createFileRoute } from "@tanstack/react-router"
import PermissionPolicyDetails from "../../../../../../clients/authorization/policy/PolicyDetails"

export const Route = createFileRoute("/$realm/permissions/$permissionClientId/policies/$policyId/$policyType")({
  component: PermissionPolicyDetails,
})
