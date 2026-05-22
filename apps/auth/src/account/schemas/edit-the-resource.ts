import { z } from "zod"

export const editTheResourceSchema = () =>
  z.object({
    permissions: z.array(
      z.object({
        username: z.string(),
        email: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        scopes: z.array(z.string()),
      })
    ),
  })

export type EditTheResourceFormValues = z.infer<
  ReturnType<typeof editTheResourceSchema>
>
