import type { ChannelTypeEnum, ICredentials } from "@novu/shared"
import type {
  ISendMessageSuccessResponse,
  ISmsOptions,
  ISmsProvider,
} from "@novu/stateless"
import type { IHandler } from "../../shared/interfaces"

export interface ISmsHandler extends IHandler {
  canHandle(providerId: string, channelType: ChannelTypeEnum)

  buildProvider(credentials: ICredentials)

  send(smsOptions: ISmsOptions): Promise<ISendMessageSuccessResponse>

  getProvider(): ISmsProvider
}
