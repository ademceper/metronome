import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getErrorDescription,
  getErrorMessage,
} from "../../shared/keycloak-ui-shared/utils/errors";
import { ApiError } from "./api-client/parse-response";

const ALERT_DURATION = 6000;

type Variant = "default" | "success" | "info" | "warning" | "danger";

const show = (message: string, variant: Variant, description?: string) => {
  const opts = description ? { description, duration: ALERT_DURATION } : { duration: ALERT_DURATION };
  switch (variant) {
    case "danger":
      return toast.error(message, opts);
    case "warning":
      return toast.warning(message, opts);
    case "info":
      return toast.info(message, opts);
    default:
      return toast.success(message, opts);
  }
};

export function useAccountAlerts() {
  const { t } = useTranslation();

  const addAlert = useCallback(
    (message: string, variant: Variant = "success", description?: string) => {
      show(message, variant, description);
    },
    [],
  );

  const addError = useCallback(
    (messageKey: string, error: unknown) => {
      if (error instanceof ApiError) {
        const message = t(messageKey, { error: error.message });
        show(message, "danger", error.description);
        return;
      }
      const message = t(messageKey, { error: getErrorMessage(error) });
      show(message, "danger", getErrorDescription(error));
    },
    [t],
  );

  return useMemo(() => ({ addAlert, addError }), [addAlert, addError]);
}
