import { createFileRoute } from "@tanstack/react-router"
import UserFederationSection from "../../components/user-federation/UserFederationSection"

export const Route = createFileRoute("/$realm/user-federation")({
  component: UserFederationSection,
})
