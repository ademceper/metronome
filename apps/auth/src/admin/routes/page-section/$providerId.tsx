import { createFileRoute } from "@tanstack/react-router"
import PageList from "../../components/page/PageList"

export const Route = createFileRoute("/page-section/$providerId")({
  component: PageList,
})
