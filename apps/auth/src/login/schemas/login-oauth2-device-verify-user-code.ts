import { z } from "zod"

export const loginOauth2DeviceVerifyUserCodeSchema = () =>
  z.object({
    device_user_code: z.string().min(1, "Code is required"),
  })

export type LoginOauth2DeviceVerifyUserCodeFormValues = z.infer<
  ReturnType<typeof loginOauth2DeviceVerifyUserCodeSchema>
>
