import { createFileRoute } from "@tanstack/react-router";
import DeviceActivity from "../../account-security/DeviceActivity";

export const Route = createFileRoute("/account-security/device-activity")({
  component: DeviceActivity,
});
