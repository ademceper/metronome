import type { TFunction } from "i18next"
import { z } from "zod"

export const shareTheResourceSchema = (
  t: TFunction,
  alreadySharedWith: string[] = []
) =>
  z
    .object({
      usernames: z.array(z.object({ value: z.string() })),
      permissions: z.array(z.string()),
    })
    .superRefine((data, ctx) => {
      const entered = data.usernames
        .map((f) => f.value)
        .filter((v) => v.trim().length > 0)

      if (entered.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["usernames"],
          message: t("required"),
        })
        return
      }

      const duplicate = entered.some((u) => alreadySharedWith.includes(u))
      if (duplicate) {
        ctx.addIssue({
          code: "custom",
          path: ["usernames"],
          message: t("resourceAlreadyShared"),
        })
      }
    })

export type ShareTheResourceFormValues = z.infer<
  ReturnType<typeof shareTheResourceSchema>
>
