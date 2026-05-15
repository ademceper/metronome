import { createFileRoute } from "@tanstack/react-router"
import AuthenticationSection from "../../../authentication/AuthenticationSection"

export const Route = createFileRoute("/$realm/authentication/$tab")({
  component: AuthenticationSection,
})
