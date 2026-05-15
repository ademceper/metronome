import { createFileRoute } from "@tanstack/react-router"
import AddOAuth2 from "../../../../identity-providers/add/AddOAuth2"

export const Route = createFileRoute("/$realm/identity-providers/oauth2/add")({
  component: AddOAuth2,
})
