import { createFileRoute } from "@tanstack/react-router"
import IdentityProvidersSection from "../../identity-providers/IdentityProvidersSection"

export const Route = createFileRoute("/$realm/identity-providers")({
  component: IdentityProvidersSection,
})
