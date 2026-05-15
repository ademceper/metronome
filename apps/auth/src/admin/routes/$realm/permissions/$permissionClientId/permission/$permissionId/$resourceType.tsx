import { createFileRoute } from "@tanstack/react-router"
import PermissionConfigurationDetails from "../../../../../../permissions-configuration/permission-configuration/PermissionConfigurationDetails"

export const Route = createFileRoute("/$realm/permissions/$permissionClientId/permission/$permissionId/$resourceType")({
  component: PermissionConfigurationDetails,
})
