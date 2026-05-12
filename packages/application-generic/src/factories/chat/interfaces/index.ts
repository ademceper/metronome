import type { IntegrationEntity } from "@novu/dal"
import type { ChannelTypeEnum, ICredentials } from "@novu/shared"
import type { IChatOptions, ISendMessageSuccessResponse } from "@novu/stateless"
import type { IHandler } from "../../shared/interfaces"

export interface IChatHandler extends IHandler {
  canHandle(providerId: string, channelType: ChannelTypeEnum)
  buildProvider(credentials: ICredentials)
  send(chatData: IChatOptions): Promise<ISendMessageSuccessResponse>
}

export interface IChatFactory {
  getHandler(
    integration: Pick<
      IntegrationEntity,
      "credentials" | "channel" | "providerId" | "configurations"
    >
  ): IChatHandler | null
}
