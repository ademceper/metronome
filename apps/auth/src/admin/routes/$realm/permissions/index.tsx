import { createFileRoute } from "@tanstack/react-router"
import PermissionsConfigurationSection from "../../../components/permissions-configuration/PermissionsConfigurationSection"

export const Route = createFileRoute("/$realm/permissions/")({
  component: PermissionsConfigurationSection,
})
