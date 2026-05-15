import { createFileRoute } from "@tanstack/react-router"
import AuthenticationSection from "../../components/authentication/AuthenticationSection"

export const Route = createFileRoute("/$realm/authentication")({
  component: AuthenticationSection,
})
