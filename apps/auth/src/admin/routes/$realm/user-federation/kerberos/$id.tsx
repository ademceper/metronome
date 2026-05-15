import { createFileRoute } from "@tanstack/react-router"
import UserFederationKerberosSettings from "../../../../user-federation/UserFederationKerberosSettings"

export const Route = createFileRoute("/$realm/user-federation/kerberos/$id")({
  component: UserFederationKerberosSettings,
})
