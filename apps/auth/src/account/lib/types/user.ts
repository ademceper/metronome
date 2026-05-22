import type { UserProfileMetadata } from "./user-profile-metadata"

export type User = any & {
  userProfileMetadata: UserProfileMetadata
}
