import { createFileRoute } from "@tanstack/react-router"
import AddIdentityProvider from "../../../../components/identity-providers/add/AddIdentityProvider"

export const Route = createFileRoute("/$realm/identity-providers/$providerId/add")({
  component: AddIdentityProvider,
})
