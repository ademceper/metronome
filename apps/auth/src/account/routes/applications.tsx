/* eslint-disable */
// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import Applications from "../applications/Applications";

export const Route = createFileRoute("/applications")({
  component: Applications,
});
