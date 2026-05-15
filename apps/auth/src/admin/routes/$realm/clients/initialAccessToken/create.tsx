import { createFileRoute } from "@tanstack/react-router"
import CreateInitialAccessToken from "../../../../clients/initial-access/CreateInitialAccessToken"

export const Route = createFileRoute("/$realm/clients/initialAccessToken/create")({
  component: CreateInitialAccessToken,
})
