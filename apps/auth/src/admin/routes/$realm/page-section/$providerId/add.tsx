import { createFileRoute } from "@tanstack/react-router"
import Page from "../../../../page/Page"

export const Route = createFileRoute("/$realm/page-section/$providerId/add")({
  component: Page,
})
