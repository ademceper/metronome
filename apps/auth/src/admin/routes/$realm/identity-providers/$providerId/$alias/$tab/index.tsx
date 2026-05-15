import { createFileRoute } from "@tanstack/react-router"
import DetailSettings from "../../../../../../components/identity-providers/add/DetailSettings"

export const Route = createFileRoute("/$realm/identity-providers/$providerId/$alias/$tab/")({
  component: DetailSettings,
})
