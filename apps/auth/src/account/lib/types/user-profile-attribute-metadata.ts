export interface UserProfileAttributeMetadata {
  name: string
  displayName: string
  required: boolean
  readOnly: boolean
  annotations?: { [index: string]: any }
  validators: { [index: string]: { [index: string]: any } }
  multivalued: boolean
  defaultValue: string
}
