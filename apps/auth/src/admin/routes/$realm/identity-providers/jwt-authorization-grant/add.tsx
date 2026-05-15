import { createFileRoute } from "@tanstack/react-router"
import AddJWTAuthorizationGrant from "../../../../components/identity-providers/add/AddJWTAuthorizationGrant"

export const Route = createFileRoute("/$realm/identity-providers/jwt-authorization-grant/add")({
  component: AddJWTAuthorizationGrant,
})
