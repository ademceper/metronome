import { createFileRoute } from "@tanstack/react-router"
import ExecutorForm from "../../../../../realm-settings/ExecutorForm"

export const Route = createFileRoute("/$realm/realm-settings/client-policies/$profileName/add-executor")({
  component: ExecutorForm,
})
