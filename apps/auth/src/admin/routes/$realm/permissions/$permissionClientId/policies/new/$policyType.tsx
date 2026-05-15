import { createFileRoute } from "@tanstack/react-router"
import NewPermissionPolicyDetails from "../../../../../../clients/authorization/policy/PolicyDetails"

export const Route = createFileRoute("/$realm/permissions/$permissionClientId/policies/new/$policyType")({
  component: NewPermissionPolicyDetails,
})
