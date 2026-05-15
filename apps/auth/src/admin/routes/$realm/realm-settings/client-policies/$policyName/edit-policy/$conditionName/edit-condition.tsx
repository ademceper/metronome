import { createFileRoute } from "@tanstack/react-router"
import NewClientPolicyCondition from "../../../../../../../components/realm-settings/NewClientPolicyCondition"

export const Route = createFileRoute("/$realm/realm-settings/client-policies/$policyName/edit-policy/$conditionName/edit-condition")({
  component: NewClientPolicyCondition,
})
