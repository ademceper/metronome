import { createFileRoute } from "@tanstack/react-router"
import PermissionsConfigurationSection from "../../../../permissions-configuration/PermissionsConfigurationSection"

export const Route = createFileRoute("/$realm/permissions/$permissionClientId/$tab")({
  component: PermissionsConfigurationSection,
})
