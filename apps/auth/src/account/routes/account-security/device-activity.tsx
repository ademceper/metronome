import { Badge } from "@metronome/ui/components/badge";
import { Button } from "@metronome/ui/components/button";
import {
  Desktop as DesktopIcon,
  DeviceMobile as MobileIcon,
  ArrowsClockwise as RefreshIcon,
} from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { DeviceActivityLoading } from "../-loading/account-security/device-activity";
import { useTranslation } from "react-i18next";

import {
  ContinueCancelModal,
  label,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared";
import { AccountEnvironment } from "../..";
import { Page } from "../../components/page";
import { useDeleteSession, useDevices } from "../../lib/api/hooks";
import { accountKeys } from "../../lib/api/keys";
import { deleteSession } from "../../lib/api/methods";
import {
  ClientRepresentation,
  DeviceRepresentation,
} from "../../lib/api/representations";
import { formatDate } from "../../lib/format-date";
import { useAccountAlerts } from "../../lib/use-account-alerts";

export const Route = createFileRoute("/account-security/device-activity")({
  component: DeviceActivity,
});

function moveCurrentToTop(devices: DeviceRepresentation[]) {
  if (devices.length === 0) return devices;
  const out = [...devices];
  const idx = out.findIndex((d) => d.current);
  if (idx > 0) {
    const [cur] = out.splice(idx, 1);
    out.unshift(cur);
  }
  if (out[0]) {
    const sessions = [...out[0].sessions];
    const sIdx = sessions.findIndex((s) => s.current);
    if (sIdx > 0) {
      const [curSess] = sessions.splice(sIdx, 1);
      sessions.unshift(curSess);
      out[0] = { ...out[0], sessions };
    }
  }
  return out;
}

function DeviceActivity() {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();
  const { addAlert, addError } = useAccountAlerts();
  const qc = useQueryClient();

  const { data: rawDevices } = useDevices();
  const devices = useMemo(
    () => (rawDevices ? moveCurrentToTop(rawDevices) : undefined),
    [rawDevices]
  );

  const refresh = () =>
    qc.invalidateQueries({ queryKey: accountKeys.devices() });

  const signOutAll = async () => {
    await deleteSession(context);
    await context.keycloak.logout();
  };

  const signOutSession = useDeleteSession({
    onSuccess: (_, _id) => {
      addAlert(t("signedOutSession"));
      refresh();
    },
    onError: (error) => addError("errorSignOutMessage", error),
  });

  const makeClientsString = (clients: ClientRepresentation[]): string => {
    let clientsString = "";
    clients.forEach((client, index) => {
      let clientName: string;
      if (client.clientName !== "") {
        clientName = label(t, client.clientName);
      } else {
        clientName = client.clientId;
      }

      clientsString += clientName;

      if (clients.length > index + 1) clientsString += ", ";
    });

    return clientsString;
  };

  if (!devices) {
    return <DeviceActivityLoading />;
  }

  const showSignOutAll =
    devices.length > 1 || devices[0].sessions.length > 1;

  return (
    <Page
      title={t("deviceActivity")}
      description={t("signedInDevicesExplanation")}
      action={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="link"
            className="h-auto px-0"
            onClick={refresh}
            id="refresh-page"
          >
            <RefreshIcon className="me-1.5 size-3.5" />
            {t("refreshPage")}
          </Button>
          {showSignOutAll && (
            <ContinueCancelModal
              buttonTitle={t("signOutAllDevices")}
              modalTitle={t("signOutAllDevices")}
              continueLabel={t("confirm")}
              cancelLabel={t("cancel")}
              buttonVariant="destructive"
              onContinue={() => signOutAll()}
            >
              {t("signOutAllDevicesWarning")}
            </ContinueCancelModal>
          )}
        </div>
      }
    >
      <div className="space-y-3">
        <h2 className="font-heading font-medium text-lg">
          {t("signedInDevices")}
        </h2>
        <div className="divide-y rounded-md border">
          {devices.map((device) =>
            device.sessions.map((session, index) => (
              <div
                key={`${device.id}-${session.id ?? index}`}
                data-testid={`row-${index}`}
                className="space-y-3 px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <div className="text-muted-foreground">
                    {device.mobile ? (
                      <MobileIcon className="size-5" />
                    ) : (
                      <DesktopIcon className="size-5" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="session-title font-medium text-sm">
                      {device.os.toLowerCase().includes("unknown")
                        ? t("unknownOperatingSystem")
                        : device.os}{" "}
                      {!device.osVersion.toLowerCase().includes("unknown") &&
                        device.osVersion}{" "}
                      / {session.browser}
                    </span>
                    {session.current && (
                      <Badge variant="outline">{t("currentSession")}</Badge>
                    )}
                  </div>
                  {!session.current && (
                    <ContinueCancelModal
                      buttonTitle={t("signOut")}
                      modalTitle={t("signOut")}
                      continueLabel={t("confirm")}
                      cancelLabel={t("cancel")}
                      buttonVariant="secondary"
                      onContinue={() => signOutSession.mutate(session.id)}
                    >
                      {t("signOutWarning")}
                    </ContinueCancelModal>
                  )}
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground text-xs">
                      {t("ipAddress")}
                    </dt>
                    <dd>{session.ipAddress}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">
                      {t("lastAccessedOn")}
                    </dt>
                    <dd>
                      {formatDate(
                        new Date(session.lastAccess * 1000),
                        context.environment.locale,
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">
                      {t("clients")}
                    </dt>
                    <dd>{makeClientsString(session.clients)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">
                      {t("started")}
                    </dt>
                    <dd>
                      {formatDate(
                        new Date(session.started * 1000),
                        context.environment.locale,
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">
                      {t("expires")}
                    </dt>
                    <dd>
                      {formatDate(
                        new Date(session.expires * 1000),
                        context.environment.locale,
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            )),
          )}
        </div>
      </div>
    </Page>
  );
}
