/* eslint-disable */
// @ts-nocheck

import {
  ContinueCancelModal,
  label,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { Button } from "@metronome/ui/components/button";
import { Spinner } from "@metronome/ui/components/spinner";
import {
  Check as CheckIcon,
  ArrowSquareOut as ExternalLinkIcon,
  Info as InfoIcon,
  CaretRight as CaretIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AccountEnvironment } from "..";
import { deleteConsent, getApplications } from "../api/methods";
import { ClientRepresentation } from "../api/representations";
import { Page } from "../components/page/Page";
import type { TFuncKey } from "../i18n-type";
import { formatDate } from "../utils/formatDate";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";

type Application = ClientRepresentation & {
  open: boolean;
};

export const Route = createFileRoute("/applications")({
  component: Applications,
});

function Applications() {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();
  const { addAlert, addError } = useAccountAlerts();

  const [applications, setApplications] = useState<Application[]>();
  const [key, setKey] = useState(1);
  const refresh = () => setKey(key + 1);

  usePromise(
    (signal) => getApplications({ signal, context }),
    (clients) => setApplications(clients.map((c) => ({ ...c, open: false }))),
    [key],
  );

  const toggleOpen = (clientId: string) => {
    setApplications([
      ...applications!.map((a) =>
        a.clientId === clientId ? { ...a, open: !a.open } : a,
      ),
    ]);
  };

  const removeConsent = async (id: string) => {
    try {
      await deleteConsent(context, id);
      refresh();
      addAlert(t("removeConsentSuccess"));
    } catch (error) {
      addError("removeConsentError", error);
    }
  };

  if (!applications) {
    return <Spinner />;
  }

  return (
    <Page title={t("application")} description={t("applicationsIntroMessage")}>
      <div className="overflow-hidden rounded-md border">
        <div className="grid grid-cols-[2rem_2fr_2fr_1fr] items-center gap-2 border-b bg-muted/40 px-4 py-3 font-medium text-sm">
          <span aria-hidden />
          <span>{t("name")}</span>
          <span>{t("applicationType")}</span>
          <span>{t("status")}</span>
        </div>
        <div className="divide-y">
          {applications.map((application) => (
            <div
              key={application.clientId}
              data-testid="applications-list-item"
            >
              <div className="grid grid-cols-[2rem_2fr_2fr_1fr] items-center gap-2 px-4 py-3 text-sm">
                <button
                  type="button"
                  onClick={() => toggleOpen(application.clientId)}
                  aria-expanded={application.open}
                  aria-controls={`content-${application.clientId}`}
                  id={`toggle-${application.clientId}`}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <CaretIcon
                    className={[
                      "size-3.5 transition-transform",
                      application.open ? "rotate-90" : "",
                    ].join(" ")}
                  />
                </button>
                <div className="min-w-0 truncate">
                  {application.effectiveUrl ? (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto px-0"
                      onClick={() => window.open(application.effectiveUrl)}
                    >
                      <span className="truncate">
                        {label(
                          t,
                          application.clientName || application.clientId,
                        )}
                      </span>
                      <ExternalLinkIcon className="ms-1 size-3.5" />
                    </Button>
                  ) : (
                    <span className="truncate">
                      {label(
                        t,
                        application.clientName || application.clientId,
                      )}
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground">
                  {application.userConsentRequired
                    ? t("thirdPartyApp")
                    : t("internalApp")}
                  {application.offlineAccess ? ", " + t("offlineAccess") : ""}
                </div>
                <div className="text-muted-foreground">
                  {application.inUse ? t("inUse") : t("notInUse")}
                </div>
              </div>

              {application.open && (
                <div
                  id={`content-${application.clientId}`}
                  className="space-y-4 border-t bg-muted/30 px-4 py-4 text-sm"
                  aria-label={t("applicationDetails", {
                    clientId: application.clientId,
                  })}
                >
                  <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2">
                    <dt className="text-muted-foreground">{t("client")}</dt>
                    <dd>{application.clientId}</dd>
                    {application.description && (
                      <>
                        <dt className="text-muted-foreground">
                          {t("description")}
                        </dt>
                        <dd>{application.description}</dd>
                      </>
                    )}
                    {application.effectiveUrl && (
                      <>
                        <dt className="text-muted-foreground">URL</dt>
                        <dd className="break-all">
                          {application.effectiveUrl.split('"')}
                        </dd>
                      </>
                    )}
                    {application.consent && (
                      <>
                        <dt className="text-muted-foreground">
                          {t("hasAccessTo")}
                        </dt>
                        <dd>
                          <ul className="space-y-1">
                            {application.consent.grantedScopes.map((scope) => (
                              <li
                                key={`scope${scope.id}`}
                                className="flex items-center gap-1.5"
                              >
                                <CheckIcon className="size-3.5 text-muted-foreground" />
                                {t(scope.name as TFuncKey, scope.displayText)}
                              </li>
                            ))}
                          </ul>
                        </dd>
                        {application.tosUri && (
                          <>
                            <dt className="text-muted-foreground">
                              {t("termsOfService")}
                            </dt>
                            <dd>{application.tosUri}</dd>
                          </>
                        )}
                        {application.policyUri && (
                          <>
                            <dt className="text-muted-foreground">
                              {t("privacyPolicy")}
                            </dt>
                            <dd>{application.policyUri}</dd>
                          </>
                        )}
                        {application.logoUri && (
                          <>
                            <dt className="text-muted-foreground">
                              {t("logo")}
                            </dt>
                            <dd>
                              <img
                                src={application.logoUri}
                                alt=""
                                className="h-8"
                              />
                            </dd>
                          </>
                        )}
                        <dt className="text-muted-foreground">
                          {t("accessGrantedOn")}
                        </dt>
                        <dd>
                          {formatDate(
                            new Date(application.consent.createdDate),
                            context.environment.locale,
                          )}
                        </dd>
                      </>
                    )}
                  </dl>
                  {(application.consent || application.offlineAccess) && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <ContinueCancelModal
                        buttonTitle={t("removeAccess")}
                        modalTitle={t("removeAccess")}
                        continueLabel={t("confirm")}
                        cancelLabel={t("cancel")}
                        buttonVariant="secondary"
                        onContinue={() => removeConsent(application.clientId)}
                      >
                        {t("removeModalMessage", { name: application.clientId })}
                      </ContinueCancelModal>
                      <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <InfoIcon className="size-3.5" />
                        {t("infoMessage")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
