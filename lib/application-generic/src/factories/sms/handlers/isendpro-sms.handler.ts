import { ISendProSmsProvider } from "@novu/providers"
import {
  ChannelTypeEnum,
  type ICredentials,
  SmsProviderIdEnum,
} from "@novu/shared"
import { BaseSmsHandler } from "./base.handler"

export class ISendProSmsHandler extends BaseSmsHandler {
  constructor() {
    super(SmsProviderIdEnum.ISendProSms, ChannelTypeEnum.SMS)
  }

  buildProvider(credentials: ICredentials) {
    const config = {
      apiKey: credentials.apiKey ?? "",
      from: credentials.from ?? "NOVU", // optional
    }

    this.provider = new ISendProSmsProvider(config)
  }
}
