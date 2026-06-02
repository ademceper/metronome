import { createRootRoute } from "@tanstack/react-router"
import { App } from "../components/app"
import { PageNotFoundSection } from "../components/page-not-found-section"

export const Route = createRootRoute({
  component: App,
  notFoundComponent: PageNotFoundSection,
})
