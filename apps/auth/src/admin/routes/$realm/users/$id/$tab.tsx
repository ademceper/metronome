import { createFileRoute } from "@tanstack/react-router"
import EditUser from "../../../../components/user/EditUser"

export const Route = createFileRoute("/$realm/users/$id/$tab")({
  component: EditUser,
})
