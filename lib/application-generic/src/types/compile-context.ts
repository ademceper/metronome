import { SubscriberEntity, TenantEntity } from "@novu/dal"
import { ContextResolved } from "@novu/framework/internal"
import { EnvironmentSystemVariables, ITriggerPayload } from "@novu/shared"

export interface ICompileContext {
  payload?: ITriggerPayload
  subscriber: SubscriberEntity
  actor?: SubscriberEntity
  webhook?: Record<string, unknown>
  tenant?: TenantEntity
  context?: ContextResolved
  env: EnvironmentSystemVariables & Record<string, string>
  step: {
    digest: boolean
    events: any[] | undefined
    total_count: number | undefined
  }
}
