import { createFileRoute } from "@tanstack/react-router"
import UsersSection from "../../../components/user/UsersSection"

export const Route = createFileRoute("/$realm/users/$tab")({
  component: UsersSection,
})
