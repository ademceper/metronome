import { createFileRoute } from "@tanstack/react-router"
import CustomProviderSettings from "../../../../components/user-federation/custom/CustomProviderSettings"

export const Route = createFileRoute("/$realm/user-federation/$providerId/$id")({
  component: CustomProviderSettings,
})
