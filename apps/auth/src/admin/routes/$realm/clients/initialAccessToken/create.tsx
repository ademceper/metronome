import { createFileRoute } from "@tanstack/react-router"
import CreateInitialAccessToken from "../../../../components/clients/initial-access/CreateInitialAccessToken"

export const Route = createFileRoute("/$realm/clients/initialAccessToken/create")({
  component: CreateInitialAccessToken,
})
