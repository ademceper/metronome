import type { IntegrationEntity } from "@novu/dal"
import type {
  ChannelTypeEnum,
  IConfigurations,
  ICredentials,
  IEmailOptions,
} from "@novu/shared"
import type {
  ICheckIntegrationResponse,
  IEmailProvider,
  ISendMessageSuccessResponse,
} from "@novu/stateless"
import type { IHandler } from "../../shared/interfaces"

export interface IMailHandler extends IHandler {
  canHandle(providerId: string, channelType: ChannelTypeEnum)

  buildProvider(credentials: ICredentials & IConfigurations, from?: string)

  send(mailData: IEmailOptions): Promise<ISendMessageSuccessResponse>

  getProvider(): IEmailProvider

  check(): Promise<ICheckIntegrationResponse>
}

export interface IMailFactory {
  getHandler(
    integration: Pick<
      IntegrationEntity,
      "credentials" | "channel" | "providerId" | "configurations"
    >
  ): IMailHandler | null
}
