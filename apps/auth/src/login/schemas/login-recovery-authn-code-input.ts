import { z } from "zod"

export const loginRecoveryAuthnCodeInputSchema = () =>
  z.object({
    recoveryCodeInput: z.string().min(1, "Recovery code is required"),
  })

export type LoginRecoveryAuthnCodeInputFormValues = z.infer<
  ReturnType<typeof loginRecoveryAuthnCodeInputSchema>
>
