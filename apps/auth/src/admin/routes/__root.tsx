import { createRootRoute } from "@tanstack/react-router"
import { App } from "../app/App"
import { PageNotFoundSection } from "../app/PageNotFoundSection"

export const Route = createRootRoute({
  component: App,
  notFoundComponent: PageNotFoundSection,
})
