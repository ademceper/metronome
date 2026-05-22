import type { TFunction } from "i18next"
import { z } from "zod"
import type { UserProfileMetadata } from "../lib/api/representations"

const ROOT_FIELDS = new Set(["username", "email", "firstName", "lastName"])

const beerify = (name: string) => name.replaceAll(".", "🍺")

export const personalInfoSchema = (
  t: TFunction,
  metadata: UserProfileMetadata
) => {
  const root: Record<string, z.ZodTypeAny> = {}
  const attrs: Record<string, z.ZodTypeAny> = {}

  for (const attr of metadata.attributes ?? []) {
    if (attr.annotations?.["inputType"] === "hidden") continue
    if (attr.readOnly) continue

    const isEmail = attr.name === "email"
    let validator: z.ZodTypeAny

    if (attr.required) {
      validator = z
        .string()
        .min(1, t("required"))
      if (isEmail) {
        validator = (validator as z.ZodString).email(t("invalidEmail"))
      }
    } else if (isEmail) {
      validator = z.union([z.literal(""), z.string().email(t("invalidEmail"))])
    } else {
      validator = z.string().optional()
    }

    if (attr.multivalued) {
      validator = z.array(z.string())
    }

    if (ROOT_FIELDS.has(attr.name)) {
      root[attr.name] = validator
    } else {
      attrs[beerify(attr.name)] = validator
    }
  }

  return z
    .object({
      ...root,
      attributes: z.object(attrs).partial().optional(),
    })
    .passthrough()
}

export type PersonalInfoFormValues = z.infer<
  ReturnType<typeof personalInfoSchema>
>
