import { createFileRoute } from "@tanstack/react-router"
import CreateUser from "../../../components/user/CreateUser"

export const Route = createFileRoute("/$realm/users/add-user")({
  component: CreateUser,
})
