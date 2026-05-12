import { Injectable, Logger } from "@nestjs/common"
import type { CommunityOrganizationRepository } from "@novu/dal"
import { JobTopicNameEnum } from "@novu/shared"
import type { IWorkflowBulkJobDto, IWorkflowJobDto } from "../../dtos"
import type { PinoLogger } from "../../logging"
import { BullMqService } from "../bull-mq"
import type { FeatureFlagsService } from "../feature-flags"
import type { WorkflowInMemoryProviderService } from "../in-memory-provider"
import type { SqsService } from "../sqs"
import { QueueBaseService } from "./queue-base.service"

const LOG_CONTEXT = "WorkflowQueueService"

@Injectable()
export class WorkflowQueueService extends QueueBaseService {
  constructor(
    public workflowInMemoryProviderService: WorkflowInMemoryProviderService,
    sqsService: SqsService,
    featureFlagsService: FeatureFlagsService,
    organizationRepository: CommunityOrganizationRepository,
    logger: PinoLogger
  ) {
    super(
      JobTopicNameEnum.WORKFLOW,
      new BullMqService(workflowInMemoryProviderService),
      sqsService,
      featureFlagsService,
      organizationRepository,
      logger
    )

    Logger.log({ topic: this.topic }, "Creating queue", LOG_CONTEXT)

    this.createQueue()
  }

  public async add(data: IWorkflowJobDto) {
    return await super.add(data)
  }

  public async addBulk(data: IWorkflowBulkJobDto[]) {
    return await super.addBulk(data)
  }
}
