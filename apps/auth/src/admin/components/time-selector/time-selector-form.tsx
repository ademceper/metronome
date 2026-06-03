/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/time-selector/TimeSelectorForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useController } from "react-hook-form";
import { TimeSelector, TimeSelectorProps } from "./time-selector";

type TimeSelectorFormProps = TimeSelectorProps & {
  name: string;
};

export const TimeSelectorForm = (props: TimeSelectorFormProps) => {
  const { field } = useController(props);

  return <TimeSelector {...props} {...field} />;
};
