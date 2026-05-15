import { createFileRoute } from "@tanstack/react-router"
import CreateUserFederationLdapSettings from "../../../../components/user-federation/CreateUserFederationLdapSettings"

export const Route = createFileRoute("/$realm/user-federation/ldap/new")({
  component: CreateUserFederationLdapSettings,
})
