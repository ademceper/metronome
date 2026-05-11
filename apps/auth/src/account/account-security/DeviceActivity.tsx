/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/DeviceActivity.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import {
  ContinueCancelModal,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { cn } from "@metronome/ui/lib/utils";
import { Desktop as DesktopIcon, DeviceMobile as MobileAltIcon, ArrowsClockwise as SyncAltIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AccountEnvironment } from "..";
import { deleteSession, getDevices } from "../api/methods";
import {
  ClientRepresentation,
  DeviceRepresentation,
  SessionRepresentation,
} from "../api/representations";
import { Page } from "../components/page/Page";
import { formatDate } from "../utils/formatDate";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";


const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
const DataList = ({ children, className, ...props }: any) => (
  <div className={cn("divide-y rounded-md border", className)} {...props}>{children}</div>
);
const DataListContent = ({ children, className, ...props }: any) => (
  <div className={cn("px-3 py-2", className)} {...props}>{children}</div>
);
const DataListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const DataListItemRow = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 px-3 py-2", className)} {...props}>{children}</div>
);
const DescriptionList = ({ isHorizontal, columnModifier, children, ...props }: any) => (
  <dl className={cn("grid gap-y-2 text-sm",
    isHorizontal && "grid-cols-[max-content_1fr] gap-x-4",
    (props as any).className)} {...props}>
    {children}
  </dl>
);
const DescriptionListDescription = ({ children, ...props }: any) => (
  <dd {...props}>{children}</dd>
);
const DescriptionListGroup = ({ children, className, ...props }: any) => (
  <div className={cn("contents", className)} {...props}>{children}</div>
);
const DescriptionListTerm = ({ children, ...props }: any) => (
  <dt className="font-medium text-muted-foreground" {...props}>{children}</dt>
);
const Grid = ({ children, className, ...props }: any) => (
  <div className={cn("grid gap-2", className)} {...props}>{children}</div>
);
const GridItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);
const TitleSizes = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;
const Title = ({ headingLevel = "h1", size, children, className, ...props }: any) =>
  React.createElement(headingLevel, {
    className: cn("font-heading font-medium", (TitleSizes as any)[size as string] ?? "text-base", className),
    ...props,
  }, children);

export const DeviceActivity = () => {
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

  return (
    <Page
      title={t("deviceActivity")}
      description={t("signedInDevicesExplanation")}
    >
      <Split hasGutter className="pf-v5-u-mb-lg">
        <SplitItem isFilled>
          <Title headingLevel="h2" size="xl">
            {t("signedInDevices")}
          </Title>
        </SplitItem>
        <SplitItem>
          <Button
            id="refresh-page"
            variant="link"
            onClick={() => refresh()}
            icon={<SyncAltIcon />}
          >
            {t("refreshPage")}
          </Button>

          {(devices.length > 1 || devices[0].sessions.length > 1) && (
            <ContinueCancelModal
              buttonTitle={t("signOutAllDevices")}
              modalTitle={t("signOutAllDevices")}
              continueLabel={t("confirm")}
              cancelLabel={t("cancel")}
              onContinue={() => signOutAll()}
            >
              {t("signOutAllDevicesWarning")}
            </ContinueCancelModal>
          )}
        </SplitItem>
      </Split>
      <DataList
        className="signed-in-device-list"
        aria-label={t("signedInDevices")}
      >
        <DataListItem aria-labelledby={`sessions-${key}`}>
          {devices.map((device) =>
            device.sessions.map((session, index) => (
              <DataListItemRow key={device.id} data-testid={`row-${index}`}>
                <DataListContent
                  aria-label="device-sessions-content"
                  className="pf-v5-u-flex-grow-1"
                >
                  <Grid hasGutter>
                    <GridItem span={1} rowSpan={2}>
                      {device.mobile ? <MobileAltIcon /> : <DesktopIcon />}
                    </GridItem>
                    <GridItem sm={8} md={9} span={10}>
                      <span className="pf-v5-u-mr-md session-title">
                        {device.os.toLowerCase().includes("unknown")
                          ? t("unknownOperatingSystem")
                          : device.os}{" "}
                        {!device.osVersion.toLowerCase().includes("unknown") &&
                          device.osVersion}{" "}
                        / {session.browser}
                      </span>
                      {session.current && (
                        <Label color="green">{t("currentSession")}</Label>
                      )}
                    </GridItem>
                    <GridItem
                      className="pf-v5-u-text-align-right"
                      sm={3}
                      md={2}
                      span={1}
                    >
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
                    </GridItem>
                    <GridItem span={11}>
                      <DescriptionList
                        className="signed-in-device-grid"
                        columnModifier={{ sm: "2Col", lg: "3Col" }}
                        cols={5}
                        rows={1}
                      >
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("ipAddress")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {session.ipAddress}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("lastAccessedOn")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {formatDate(
                              new Date(session.lastAccess * 1000),
                              context.environment.locale,
                            )}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("clients")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {makeClientsString(session.clients)}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("started")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {formatDate(
                              new Date(session.started * 1000),
                              context.environment.locale,
                            )}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("expires")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {formatDate(
                              new Date(session.expires * 1000),
                              context.environment.locale,
                            )}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </GridItem>
                  </Grid>
                </DataListContent>
              </DataListItemRow>
            )),
          )}
        </DataListItem>
      </DataList>
    </Page>
  );
};

export default DeviceActivity;
