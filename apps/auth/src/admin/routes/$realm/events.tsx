import { createFileRoute } from "@tanstack/react-router"
import EventsSection from "../../components/events/EventsSection"

export const Route = createFileRoute("/$realm/events")({
  component: EventsSection,
})
