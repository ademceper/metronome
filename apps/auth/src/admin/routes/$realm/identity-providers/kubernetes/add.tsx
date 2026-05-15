import { createFileRoute } from "@tanstack/react-router"
import AddKubernetesConnect from "../../../../components/identity-providers/add/AddKubernetesConnect"

export const Route = createFileRoute("/$realm/identity-providers/kubernetes/add")({
  component: AddKubernetesConnect,
})
