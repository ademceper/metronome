/* eslint-disable */
// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import LinkedAccounts from "../../account-security/LinkedAccounts";

export const Route = createFileRoute("/account-security/linked-accounts")({
  component: LinkedAccounts,
});
