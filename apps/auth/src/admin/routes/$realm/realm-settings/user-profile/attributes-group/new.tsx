// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import AttributesGroupForm from "../../../../../components/realm-settings/user-profile/attributes-group-form";
import { UserProfileProvider } from "../../../../../components/realm-settings/user-profile/user-profile-context";

const AttributesGroupDetails = () => (
  <UserProfileProvider>
    <AttributesGroupForm />
  </UserProfileProvider>
);

export const Route = createFileRoute("/$realm/realm-settings/user-profile/attributes-group/new")({
  component: AttributesGroupDetails,
})
