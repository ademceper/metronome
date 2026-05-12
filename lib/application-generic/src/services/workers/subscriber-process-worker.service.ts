import { JobTopicNameEnum } from "@novu/shared"
import type { PinoLogger } from "../../logging"
import type { BullMqService } from "../bull-mq"
import type { SqsService } from "../sqs"
import { WorkerBaseService } from "./worker-base.service"

const LOG_CONTEXT = "SubscriberProcessWorkerService"

export class SubscriberProcessWorkerService extends WorkerBaseService {
  constructor(
    bullMqService: BullMqService,
    sqsService?: SqsService,
    logger?: PinoLogger
  ) {
    super(
      JobTopicNameEnum.PROCESS_SUBSCRIBER,
      bullMqService,
      sqsService,
      logger
    )
  }
}
