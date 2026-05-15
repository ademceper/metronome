import { createFileRoute } from "@tanstack/react-router"
import DetailProvider from "../../../../../clients/registration/DetailProvider"

export const Route = createFileRoute("/$realm/clients/client-registration/$subTab/$providerId")({
  component: DetailProvider,
})
