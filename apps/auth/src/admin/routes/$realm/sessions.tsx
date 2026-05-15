import { createFileRoute } from "@tanstack/react-router"
import SessionsSection from "../../components/sessions/SessionsSection"

export const Route = createFileRoute("/$realm/sessions")({
  component: SessionsSection,
})
