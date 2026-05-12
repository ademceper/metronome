import type { ContextResolved } from "@novu/framework/internal"
import type { ResourceOriginEnum } from "@novu/shared"
import { EnvironmentWithUserCommand } from "../../commands"
import type { SubscriberResponseDtoOptional } from "../../dtos/subscribers/subscriber-response.dto"
import type { FrameworkPreviousStepsOutputState } from "../preview/preview.types"

export class PreviewStepCommand extends EnvironmentWithUserCommand {
  workflowId: string
  stepId: string
  controls: Record<string, unknown>
  payload: Record<string, unknown>
  context?: ContextResolved
  subscriber?: SubscriberResponseDtoOptional
  workflowOrigin: ResourceOriginEnum
  state?: FrameworkPreviousStepsOutputState[]
  skipLayoutRendering?: boolean
  layoutId?: string
  stepResolverHash?: string
  env?: Record<string, string>
}
