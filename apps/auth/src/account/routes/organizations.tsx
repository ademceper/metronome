/* eslint-disable */
// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import Organizations from "../organizations/Organizations";

export const Route = createFileRoute("/organizations")({
  component: Organizations,
});
