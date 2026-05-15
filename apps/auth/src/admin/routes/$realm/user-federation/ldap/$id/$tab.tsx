import { createFileRoute } from "@tanstack/react-router"
import UserFederationLdapSettings from "../../../../../user-federation/UserFederationLdapSettings"

export const Route = createFileRoute("/$realm/user-federation/ldap/$id/$tab")({
  component: UserFederationLdapSettings,
})
