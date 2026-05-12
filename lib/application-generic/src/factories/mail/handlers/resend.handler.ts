import { ResendEmailProvider } from "@novu/providers"
import {
  ChannelTypeEnum,
  EmailProviderIdEnum,
  type IConfigurations,
  type ICredentials,
} from "@novu/shared"
import { BaseEmailHandler } from "./base.handler"

export class ResendHandler extends BaseEmailHandler {
  constructor() {
    super(EmailProviderIdEnum.Resend, ChannelTypeEnum.EMAIL)
  }
  buildProvider(credentials: ICredentials & IConfigurations, from?: string) {
    this.provider = new ResendEmailProvider({
      from: from as string,
      apiKey: credentials.apiKey as string,
      senderName: credentials.senderName,
      webhookSigningKey: credentials.inboundWebhookSigningKey,
    })
  }
}
