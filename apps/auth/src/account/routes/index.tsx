/* eslint-disable */
// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import PersonalInfo from "../personal-info/PersonalInfo";

export const Route = createFileRoute("/")({
  component: PersonalInfo,
});
