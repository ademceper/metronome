import { createFileRoute } from "@tanstack/react-router"
import UserFederationKerberosSettings from "../../../../components/user-federation/UserFederationKerberosSettings"

export const Route = createFileRoute("/$realm/user-federation/kerberos/new")({
  component: UserFederationKerberosSettings,
})
