import { EnvironmentWithUserObjectCommand } from "../../commands"
import type { GeneratePreviewRequestDto } from "../../dtos/workflow/generate-preview-request.dto"

export class PreviewCommand extends EnvironmentWithUserObjectCommand {
  workflowIdOrInternalId: string
  stepIdOrInternalId: string
  generatePreviewRequestDto: GeneratePreviewRequestDto
  skipLayoutRendering?: boolean
}
