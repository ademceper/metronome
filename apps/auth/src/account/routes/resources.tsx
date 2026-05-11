/* eslint-disable */
// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import Resources from "../resources/Resources";

export const Route = createFileRoute("/resources")({
  component: Resources,
});
