import { Button } from "@metronome/ui/components/button";
import { Link } from "@metronome/ui/components/link";
import {
  Info as InfoAltIcon,
  Warning as ExclamationTriangleIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { SigningInLoading } from "../-loading/account-security/signing-in";
import { Fragment } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  type KeycloakContext,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared";
import { Page } from "../../components/page";
import type { TFuncKey } from "../../i18n/types";
import { useCredentials } from "../../lib/api";
import { CredentialMetadata } from "../../lib/api";
import { formatDate } from "../../lib/format-date";
import { AccountEnvironment } from "../..";

export const Route = createFileRoute("/account-security/signing-in")({
  component: SigningIn,
});

function SigningIn() {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();
  const { login } = context.keycloak;

  const { data: credentials } = useCredentials();

  if (!credentials) {
    return <SigningInLoading />;
  }

  const categories = [...new Set(credentials.map((c) => c.category))];

  const renderMetadata = (
    credMetadata: CredentialMetadata,
    context: KeycloakContext<AccountEnvironment>,
  ) => {
    const credential = credMetadata.credential;
    return (
      <div className="min-w-0 flex-1 space-y-1">
        <div className="truncate font-medium text-sm">
          {t(credential.userLabel) || t(credential.type as TFuncKey)}
        </div>
        {credential.createdDate && (
          <div className="text-muted-foreground text-xs">
            <Trans
              i18nKey="credentialCreatedAt"
              values={{
                date: formatDate(
                  new Date(credential.createdDate),
                  context.environment.locale,
                ),
              }}
            >
              <strong className="me-1" />
            </Trans>
          </div>
        )}
        {credMetadata.infoMessage && (
          <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <InfoAltIcon className="size-3.5" />
            {t(
              credMetadata.infoMessage.key,
              credMetadata.infoMessage.parameters?.reduce(
                (acc, val, idx) => ({ ...acc, [idx]: val }),
                {},
              ),
            )}
          </p>
        )}
        {credMetadata.infoProperties && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-xs">
            {credMetadata.infoProperties.map((prop) => (
              <Fragment key={prop.key}>
                <dt className="text-muted-foreground">{t(prop.key)}</dt>
                <dd>{prop.parameters ? prop.parameters[0] : ""}</dd>
              </Fragment>
            ))}
          </dl>
        )}
        {credMetadata.warningMessageTitle &&
          credMetadata.warningMessageDescription && (
            <div className="space-y-1 text-destructive text-xs">
              <p className="flex items-center gap-1.5">
                <ExclamationTriangleIcon className="size-3.5" />
                {t(
                  credMetadata.warningMessageTitle.key,
                  credMetadata.warningMessageTitle.parameters?.reduce(
                    (acc, val, idx) => ({ ...acc, [idx]: val }),
                    {},
                  ),
                )}
              </p>
              <p>
                {t(
                  credMetadata.warningMessageDescription.key,
                  credMetadata.warningMessageDescription.parameters?.reduce(
                    (acc, val, idx) => ({ ...acc, [idx]: val }),
                    {},
                  ),
                )}
              </p>
            </div>
          )}
      </div>
    );
  };

  return (
    <Page title={t("signingIn")} description={t("signingInDescription")}>
      <div className="space-y-8">
        {categories.map((category) => (
          <section key={category} className="space-y-6">
            <h2
              id={`${category}-categ-title`}
              className="font-heading font-medium text-lg"
            >
              {t(category as TFuncKey)}
            </h2>
            {credentials
              .filter((cred) => cred.category == category)
              .map((container) => (
                <div key={container.type} className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3
                        data-testid={`${container.type}/title`}
                        className="font-medium text-base"
                      >
                        {t(container.displayName as TFuncKey)}
                      </h3>
                      <p
                        data-testid={`${container.type}/help-text`}
                        className="text-muted-foreground text-sm"
                      >
                        {t(container.helptext as TFuncKey)}
                      </p>
                    </div>
                    {container.createAction && (
                      <Link
                        as="button"
                        type="button"
                        className="shrink-0"
                        data-testid={`${container.type}/create`}
                        onClick={() => login({ action: container.createAction })}
                      >
                        {t("setUpNew", {
                          name: t(
                            `${container.type}-display-name` as TFuncKey,
                          ),
                        })}
                      </Link>
                    )}
                  </div>

                  <div
                    data-testid={`${container.type}/credential-list`}
                    className="divide-y rounded-md border"
                  >
                    {container.userCredentialMetadatas.length === 0 ? (
                      <p
                        data-testid={`${container.type}/not-set-up`}
                        className="px-4 py-3 text-muted-foreground text-sm"
                      >
                        {t("notSetUp", {
                          name: t(container.displayName as TFuncKey),
                        })}
                      </p>
                    ) : (
                      container.userCredentialMetadatas.map((meta) => (
                        <div
                          key={meta.credential.id}
                          id={`cred-${meta.credential.id}`}
                          className="flex items-center gap-4 px-4 py-3"
                        >
                          {renderMetadata(meta, context)}
                          <div className="flex shrink-0 items-center gap-2">
                            {container.updateAction && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                data-testrole="update"
                                onClick={async () => {
                                  await login({
                                    action: container.updateAction,
                                  });
                                }}
                              >
                                {t("update")}
                              </Button>
                            )}
                            {container.removeable && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                data-testrole="remove"
                                className="bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
                                onClick={async () => {
                                  await login({
                                    action:
                                      "delete_credential:" + meta.credential.id,
                                  });
                                }}
                              >
                                {t("delete")}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
          </section>
        ))}
      </div>
    </Page>
  );
}
