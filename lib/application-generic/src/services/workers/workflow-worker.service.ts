import { JobTopicNameEnum } from "@novu/shared"
import type { PinoLogger } from "../../logging"
import type { BullMqService } from "../bull-mq"
import type { SqsService } from "../sqs"
import { WorkerBaseService } from "./worker-base.service"

const LOG_CONTEXT = "WorkflowWorkerService"

export class WorkflowWorkerService extends WorkerBaseService {
  constructor(
    bullMqService: BullMqService,
    sqsService?: SqsService,
    logger?: PinoLogger
  ) {
    super(JobTopicNameEnum.WORKFLOW, bullMqService, sqsService, logger)
  }
}
