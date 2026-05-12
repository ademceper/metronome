import { ChannelTypeEnum, ShortIsPrefixEnum } from "@novu/shared"
import type { JSONSchemaDto } from "../../dtos/json-schema.dto"
import type { EmailControlsDto } from "../../dtos/layout/layout-controls.dto"
import type { LayoutResponseDto } from "../../dtos/layout/layout-response.dto"
import type { LayoutDto } from "../../dtos/layout/v0/layout.dto"
import { buildSlug } from "../../utils/build-slug"

export const mapLayoutToResponseDto = ({
  layout,
  controlValues,
  variables,
}: {
  layout: LayoutDto
  controlValues?: Record<string, unknown> | null
  variables?: JSONSchemaDto
}): LayoutResponseDto => {
  const isEmailLayout =
    layout.channel === ChannelTypeEnum.EMAIL && controlValues?.email

  return {
    _id: layout._id!,
    layoutId: layout.identifier,
    name: layout.name,
    slug: buildSlug(layout.name, ShortIsPrefixEnum.LAYOUT, layout._id!),
    isDefault: layout.isDefault,
    updatedAt: layout.updatedAt!,
    updatedBy: layout.updatedBy
      ? {
          _id: layout.updatedBy._id,
          firstName: layout.updatedBy.firstName,
          lastName: layout.updatedBy.lastName,
          externalId: layout.updatedBy.externalId,
        }
      : undefined,
    createdAt: layout.createdAt!,
    origin: layout.origin!,
    type: layout.type!,
    variables,
    controls: {
      uiSchema: layout.controls?.uiSchema,
      dataSchema: layout.controls?.dataSchema,
      values: {
        ...(isEmailLayout
          ? { email: controlValues?.email as EmailControlsDto }
          : {}),
      },
    },
    isTranslationEnabled: !!layout.isTranslationEnabled,
  }
}
