import { createFileRoute } from "@tanstack/react-router"
import PermissionConfigurationDetails from "../../../../../../../permissions-configuration/permission-configuration/PermissionConfigurationDetails"

export const Route = createFileRoute("/$realm/clients/$id/permissions/permission/$permissionId/$permissionType")({
  component: PermissionConfigurationDetails,
})
