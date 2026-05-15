import { createRootRoute } from "@tanstack/react-router"
import { PageNotFoundSection } from "../app/PageNotFoundSection"
import { Root } from "../app/Root"

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: PageNotFoundSection,
})
