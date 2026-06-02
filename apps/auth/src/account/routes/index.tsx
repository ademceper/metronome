import { createFileRoute } from "@tanstack/react-router"
import { PersonalInfoPage } from "./-personal-info-page"

export const Route = createFileRoute("/")({
  component: PersonalInfoPage,
})
