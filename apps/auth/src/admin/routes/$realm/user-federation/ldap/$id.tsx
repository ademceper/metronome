import { createFileRoute } from "@tanstack/react-router"
import UserFederationLdapSettings from "../../../../components/user-federation/UserFederationLdapSettings"

export const Route = createFileRoute("/$realm/user-federation/ldap/$id")({
  component: UserFederationLdapSettings,
})
