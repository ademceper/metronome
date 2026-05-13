import { AiResourceTypeEnum, SnapshotSourceTypeEnum } from "@novu/shared"
import { ChangePropsValueType } from "../../types/helpers"
import { EnvironmentId } from "../environment"
import { OrganizationId } from "../organization"

export class SnapshotEntity {
  _id: string
  _environmentId: EnvironmentId
  _organizationId: OrganizationId

  resourceType: AiResourceTypeEnum
  resourceId?: string

  sourceType: SnapshotSourceTypeEnum
  sourceId: string

  data: unknown | null

  createdAt: string
  updatedAt: string
}

export type SnapshotDBModel = ChangePropsValueType<
  SnapshotEntity,
  "_environmentId" | "_organizationId"
>
