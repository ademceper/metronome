import { createFileRoute } from "@tanstack/react-router"
import ClientProfileForm from "../../../../../realm-settings/ClientProfileForm"

export const Route = createFileRoute("/$realm/realm-settings/client-policies/$tab/add-profile")({
  component: ClientProfileForm,
})
