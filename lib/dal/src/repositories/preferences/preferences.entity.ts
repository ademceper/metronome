import {
  PreferencesTypeEnum,
  Schedule,
  WorkflowPreferencesPartial,
} from "@novu/shared"
import { ChangePropsValueType } from "../../types"
import { EnvironmentId } from "../environment"
import { OrganizationId } from "../organization"
import { SubscriberId } from "../subscriber"
import { UserId } from "../user"

export type PreferencesDBModel = ChangePropsValueType<
  PreferencesEntity,
  | "_environmentId"
  | "_organizationId"
  | "_subscriberId"
  | "_templateId"
  | "_userId"
  | "_topicSubscriptionId"
>

export class PreferencesEntity {
  _id: string

  _organizationId: OrganizationId

  _environmentId: EnvironmentId

  _subscriberId?: SubscriberId

  _userId?: UserId

  // workflowEntityId
  _templateId?: string

  _topicSubscriptionId?: string

  type: PreferencesTypeEnum

  preferences: WorkflowPreferencesPartial

  schedule?: Schedule

  contextKeys?: string[]

  contextKeysHash?: string

  createdAt?: string

  updatedAt?: string
}
