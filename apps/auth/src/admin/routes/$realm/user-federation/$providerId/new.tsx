import { createFileRoute } from "@tanstack/react-router"
import CustomProviderSettings from "../../../../user-federation/custom/CustomProviderSettings"

export const Route = createFileRoute("/$realm/user-federation/$providerId/new")({
  component: CustomProviderSettings,
})
