import { createFileRoute } from "@tanstack/react-router"
import PermissionsPoliciesSection from "../../../../permissions-configuration/PermissionsConfigurationSection"

export const Route = createFileRoute("/$realm/permissions/$permissionClientId/policies")({
  component: PermissionsPoliciesSection,
})
