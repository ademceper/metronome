import { createFileRoute } from "@tanstack/react-router"
import Page from "../../../../components/page/Page"

export const Route = createFileRoute("/$realm/page-section/$providerId/$id")({
  component: Page,
})
