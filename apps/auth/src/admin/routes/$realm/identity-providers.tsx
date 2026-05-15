import { createFileRoute } from "@tanstack/react-router"
import IdentityProvidersSection from "../../components/identity-providers/IdentityProvidersSection"

export const Route = createFileRoute("/$realm/identity-providers")({
  component: IdentityProvidersSection,
})
