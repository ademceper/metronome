import { createFileRoute } from "@tanstack/react-router"
import ImportForm from "../../../clients/import/ImportForm"

export const Route = createFileRoute("/$realm/clients/import-client")({
  component: ImportForm,
})
