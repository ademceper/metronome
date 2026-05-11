/* eslint-disable */
// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import Groups from "../groups/Groups";

export const Route = createFileRoute("/groups")({
  component: Groups,
});
