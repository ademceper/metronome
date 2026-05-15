import { createFileRoute } from "@tanstack/react-router"
import UsersSection from "../../user/UsersSection"

export const Route = createFileRoute("/$realm/users")({
  component: UsersSection,
})
