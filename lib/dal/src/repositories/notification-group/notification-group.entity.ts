import { ChangePropsValueType } from "../../types/helpers"
import { EnvironmentId } from "../environment"
import { OrganizationId } from "../organization"

export class NotificationGroupEntity {
  _id: string

  name: string

  _environmentId: EnvironmentId

  _organizationId: OrganizationId

  _parentId?: string
}

export type NotificationGroupDBModel = ChangePropsValueType<
  NotificationGroupEntity,
  "_environmentId" | "_organizationId" | "_parentId"
>
