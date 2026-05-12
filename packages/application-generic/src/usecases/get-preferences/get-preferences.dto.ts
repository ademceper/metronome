import {
  PreferencesTypeEnum,
  type Schedule,
  type SubscriberGlobalPreference,
  type WorkflowPreferences,
  type WorkflowPreferencesPartial,
} from "@novu/shared"

export class GetPreferencesResponseDto {
  preferences: WorkflowPreferences

  schedule?: Schedule

  type: PreferencesTypeEnum

  source: {
    [PreferencesTypeEnum.WORKFLOW_RESOURCE]: WorkflowPreferences
    [PreferencesTypeEnum.USER_WORKFLOW]: WorkflowPreferences | null
    [PreferencesTypeEnum.SUBSCRIBER_GLOBAL]: SubscriberGlobalPreference | null
    [PreferencesTypeEnum.SUBSCRIBER_WORKFLOW]: WorkflowPreferencesPartial | null
  }
}
