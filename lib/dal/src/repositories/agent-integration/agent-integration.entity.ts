import { ChangePropsValueType } from "../../types/helpers"
import { EnvironmentId } from "../environment"
import { OrganizationId } from "../organization"

export class AgentIntegrationEntity {
  _id: string

  _agentId: string

  _integrationId: string

  _environmentId: EnvironmentId

  _organizationId: OrganizationId

  connectedAt?: string | null

  createdAt: string

  updatedAt: string
}

export type AgentIntegrationDBModel = ChangePropsValueType<
  AgentIntegrationEntity,
  "_agentId" | "_integrationId" | "_environmentId" | "_organizationId"
>
