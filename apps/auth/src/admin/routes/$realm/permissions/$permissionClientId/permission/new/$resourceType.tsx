import { createFileRoute } from "@tanstack/react-router"
import PermissionConfigurationDetails from "../../../../../../components/permissions-configuration/permission-configuration/PermissionConfigurationDetails"

export const Route = createFileRoute("/$realm/permissions/$permissionClientId/permission/new/$resourceType")({
  component: PermissionConfigurationDetails,
})
