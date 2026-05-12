import { Injectable } from "@nestjs/common"
import {
  type EnvironmentRepository,
  type EnvironmentVariableRepository,
  JsonSchemaTypeEnum,
} from "@novu/dal"
import {
  type EnvironmentSystemVariables,
  LAYOUT_CONTENT_VARIABLE,
} from "@novu/shared"
import type { JSONSchemaDto } from "../../dtos/json-schema.dto"
import { resolveEnvironmentVariables } from "../../encryption/encrypt-environment-variable"
import { InstrumentUsecase } from "../../instrumentation"
import {
  buildContextSchema,
  buildEnvSchema,
  buildSubscriberSchema,
} from "../../utils/create-schema"
import { CreateVariablesObjectCommand } from "../create-variables-object/create-variables-object.command"
import type { CreateVariablesObject } from "../create-variables-object/create-variables-object.usecase"
import type { LayoutVariablesSchemaCommand } from "./layout-variables-schema.command"

@Injectable()
export class LayoutVariablesSchemaUseCase {
  constructor(
    private readonly createVariablesObject: CreateVariablesObject,
    private readonly environmentVariableRepository: EnvironmentVariableRepository,
    private readonly environmentRepository: EnvironmentRepository
  ) {}

  @InstrumentUsecase()
  async execute(command: LayoutVariablesSchemaCommand): Promise<JSONSchemaDto> {
    const { controlValues } = command

    const [{ subscriber, context }, rawEnvVars, environmentEntity] =
      await Promise.all([
        this.createVariablesObject.execute(
          CreateVariablesObjectCommand.create({
            environmentId: command.environmentId,
            organizationId: command.organizationId,
            controlValues: Object.values(controlValues?.email ?? {}),
          })
        ),
        this.environmentVariableRepository.findByEnvironment(
          command.organizationId,
          command.environmentId
        ),
        this.environmentRepository.findByIdAndOrganization(
          command.environmentId,
          command.organizationId
        ),
      ])

    const systemVars: EnvironmentSystemVariables | Record<string, never> =
      environmentEntity
        ? { name: environmentEntity.name, type: environmentEntity.type }
        : {}
    const envVars = {
      ...resolveEnvironmentVariables(rawEnvVars),
      ...systemVars,
    }

    return {
      type: JsonSchemaTypeEnum.OBJECT,
      properties: {
        subscriber: buildSubscriberSchema(subscriber),
        [LAYOUT_CONTENT_VARIABLE]: {
          type: JsonSchemaTypeEnum.STRING,
        },
        context: buildContextSchema(context),
        env: buildEnvSchema(envVars),
      },
      additionalProperties: false,
    }
  }
}
