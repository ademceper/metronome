/* eslint-disable */
// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import ContentComponent from "../../content/ContentComponent";

export const Route = createFileRoute("/content/$componentId")({
  component: ContentComponent,
});
