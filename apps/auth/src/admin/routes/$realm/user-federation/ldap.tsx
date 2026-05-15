import { createFileRoute } from "@tanstack/react-router"
import UserFederationSection from "../../../user-federation/UserFederationSection"

export const Route = createFileRoute("/$realm/user-federation/ldap")({
  component: UserFederationSection,
})
