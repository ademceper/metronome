import { createFileRoute } from "@tanstack/react-router"
import LdapMapperDetails from "../../../../../../user-federation/ldap/mappers/LdapMapperDetails"

export const Route = createFileRoute("/$realm/user-federation/ldap/$id/mappers/$mapperId")({
  component: LdapMapperDetails,
})
