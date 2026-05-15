import { createFileRoute } from "@tanstack/react-router"
import KeyProviderForm from "../../../../../../../components/realm-settings/keys/key-providers/KeyProviderForm"

export const Route = createFileRoute("/$realm/realm-settings/keys/providers/$id/$providerType/settings")({
  component: KeyProviderForm,
})
