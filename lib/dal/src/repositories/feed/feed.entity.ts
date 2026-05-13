import { ChangePropsValueType } from "../../types/helpers"
import { EnvironmentId } from "../environment"
import { OrganizationId } from "../organization"

export class FeedEntity {
  _id: string

  name: string

  identifier: string

  _environmentId: EnvironmentId

  _organizationId: OrganizationId
}

export type FeedDBModel = ChangePropsValueType<
  FeedEntity,
  "_environmentId" | "_organizationId"
>
