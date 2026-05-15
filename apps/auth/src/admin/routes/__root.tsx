import { createRootRoute } from "@tanstack/react-router"
import { PageNotFoundSection } from "../PageNotFoundSection"
import { Root } from "../Root"

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: PageNotFoundSection,
})
