import { createFileRoute } from "@tanstack/react-router"
import PageList from "../../../page/PageList"

export const Route = createFileRoute("/$realm/page-section/$providerId")({
  component: PageList,
})
