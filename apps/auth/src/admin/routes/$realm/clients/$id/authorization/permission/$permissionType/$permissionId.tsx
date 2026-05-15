import { createFileRoute } from "@tanstack/react-router"
import PermissionDetails from "../../../../../../../clients/authorization/PermissionDetails"

export const Route = createFileRoute("/$realm/clients/$id/authorization/permission/$permissionType/$permissionId")({
  component: PermissionDetails,
})
