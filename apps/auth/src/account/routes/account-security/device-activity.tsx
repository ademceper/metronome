/* eslint-disable */
// @ts-nocheck

import {
  ContinueCancelModal,
  label,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared";
import { Badge } from "@metronome/ui/components/badge";
import { Button } from "@metronome/ui/components/button";
import { Spinner } from "@metronome/ui/components/spinner";
import {
  Desktop as DesktopIcon,
  DeviceMobile as MobileIcon,
  ArrowsClockwise as RefreshIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AccountEnvironment } from "../..";
import { deleteSession, getDevices } from "../../lib/api/methods";
import {
  ClientRepresentation,
  DeviceRepresentation,
  SessionRepresentation,
} from "../../lib/api/representations";
import { Page } from "../../components/Page";
import { formatDate } from "../../lib/formatDate";
import { useAccountAlerts } from "../../lib/useAccountAlerts";
import { usePromise } from "../../lib/usePromise";

export const Route = createFileRoute("/account-security/device-activity")({
  component: DeviceActivity,
});

function DeviceActivity() {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();
  const { addAlert, addError } = useAccountAlerts();

  const [devices, setDevices] = useState<DeviceRepresentation[]>();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const moveCurrentToTop = (devices: DeviceRepresentation[]) => {
    let currentDevice = devices[0];

    const index = devices.findIndex((d) => d.current);
    currentDevice = devices.splice(index, 1)[0];
    devices.unshift(currentDevice);

    const sessionIndex = currentDevice.sessions.findIndex((s) => s.current);
    const currentSession = currentDevice.sessions.splice(sessionIndex, 1)[0];
    currentDevice.sessions.unshift(currentSession);

    setDevices(devices);
  };

  usePromise((signal) => getDevices({ signal, context }), moveCurrentToTop, [
    key,
  ]);

  const signOutAll = async () => {
    await deleteSession(context);
    await context.keycloak.logout();
  };

  const signOutSession = async (
    session: SessionRepresentation,
    device: DeviceRepresentation,
  ) => {
    try {
      await deleteSession(context, session.id);
      addAlert(
        t("signedOutSession", { browser: session.browser, os: device.os }),
      );
      refresh();
    } catch (error) {
      addError("errorSignOutMessage", error);
    }
  };

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
    return <Spinner />;
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
                      onContinue={() => signOutSession(session, device)}
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
