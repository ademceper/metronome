import { IPreferenceChannels } from "@novu/shared"
import { ChangePropsValueType } from "../../types"
import { EnvironmentId } from "../environment"
import { NotificationTemplateEntity } from "../notification-template"
import { OrganizationId } from "../organization"
import { TenantEntity } from "../tenant"
import { WorkflowOverrideId } from "./types"

export class WorkflowOverrideEntity {
  _id: WorkflowOverrideId

  _organizationId: OrganizationId

  _environmentId: EnvironmentId

  _workflowId: string

  readonly workflow?: NotificationTemplateEntity

  _tenantId: string

  readonly tenant?: TenantEntity

  active: boolean

  preferenceSettings: IPreferenceChannels

  deleted: boolean

  deletedAt?: string

  deletedBy?: string

  createdAt: string

  updatedAt?: string
}

export type WorkflowOverrideDBModel = ChangePropsValueType<
  WorkflowOverrideEntity,
  "_environmentId" | "_organizationId" | "_workflowId" | "_tenantId"
>
