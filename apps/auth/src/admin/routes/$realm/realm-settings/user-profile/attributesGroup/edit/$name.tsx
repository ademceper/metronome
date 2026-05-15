// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import AttributesGroupForm from "../../../../../../components/realm-settings/user-profile/AttributesGroupForm";
import { UserProfileProvider } from "../../../../../../components/realm-settings/user-profile/UserProfileContext";

const AttributesGroupDetails = () => (
  <UserProfileProvider>
    <AttributesGroupForm />
  </UserProfileProvider>
);

export const Route = createFileRoute("/$realm/realm-settings/user-profile/attributesGroup/edit/$name")({
  component: AttributesGroupDetails,
})
