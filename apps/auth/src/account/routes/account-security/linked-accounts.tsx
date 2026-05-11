/* eslint-disable */
// @ts-nocheck

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnvironment } from "../../../shared/keycloak-ui-shared";
import { getLinkedAccounts, LinkedAccountQueryParams } from "../../lib/api/methods";
import { EmptyRow } from "../../components/EmptyRow";
import { Page } from "../../components/Page";
import { AccountRow } from "./-AccountRow";
import { LinkedAccountsToolbar } from "./-LinkedAccountsToolbar";

export const Route = createFileRoute("/account-security/linked-accounts")({
  component: LinkedAccounts,
});

function LinkedAccounts() {
  const { t } = useTranslation();
  const context = useEnvironment();
  const qc = useQueryClient();

  const [paramsUnlinked, setParamsUnlinked] =
    useState<LinkedAccountQueryParams>({
      first: 0,
      max: 6,
      linked: false,
    });
  const [paramsLinked, setParamsLinked] = useState<LinkedAccountQueryParams>({
    first: 0,
    max: 6,
    linked: true,
  });

  const { data: linkedAccounts = [] } = useQuery({
    queryKey: ["account", "linkedAccounts", paramsLinked],
    queryFn: ({ signal }) =>
      getLinkedAccounts({ signal, context }, paramsLinked),
  });
  const { data: unlinkedAccounts = [] } = useQuery({
    queryKey: ["account", "linkedAccounts", paramsUnlinked],
    queryFn: ({ signal }) =>
      getLinkedAccounts({ signal, context }, paramsUnlinked),
  });

  const refresh = () =>
    qc.invalidateQueries({ queryKey: ["account", "linkedAccounts"] });

  return (
    <Page
      title={t("linkedAccounts")}
      description={t("linkedAccountsIntroMessage")}
    >
      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="font-heading font-medium text-lg">
            {t("linkedLoginProviders")}
          </h2>
          <LinkedAccountsToolbar
            onFilter={(search) =>
              setParamsLinked({ ...paramsLinked, first: 0, search })
            }
            count={linkedAccounts.length}
            first={paramsLinked["first"]}
            max={paramsLinked["max"]}
            onNextClick={() => {
              setParamsLinked({
                ...paramsLinked,
                first: paramsLinked.first + paramsLinked.max - 1,
              });
            }}
            onPreviousClick={() =>
              setParamsLinked({
                ...paramsLinked,
                first: paramsLinked.first - paramsLinked.max + 1,
              })
            }
            onPerPageSelect={(first, max) =>
              setParamsLinked({
                ...paramsLinked,
                first,
                max,
              })
            }
            hasNext={linkedAccounts.length > paramsLinked.max - 1}
          />
          <div
            id="linked-idps"
            aria-label={t("linkedLoginProviders")}
            className="divide-y rounded-md border"
          >
            {linkedAccounts.length > 0 ? (
              linkedAccounts.map(
                (account, index) =>
                  index !== paramsLinked.max - 1 && (
                    <AccountRow
                      key={account.providerName}
                      account={account}
                      isLinked
                      refresh={refresh}
                    />
                  ),
              )
            ) : (
              <EmptyRow message={t("linkedEmpty")} />
            )}
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="font-heading font-medium text-lg">
            {t("unlinkedLoginProviders")}
          </h2>
          <LinkedAccountsToolbar
            onFilter={(search) =>
              setParamsUnlinked({ ...paramsUnlinked, first: 0, search })
            }
            count={unlinkedAccounts.length}
            first={paramsUnlinked["first"]}
            max={paramsUnlinked["max"]}
            onNextClick={() => {
              setParamsUnlinked({
                ...paramsUnlinked,
                first: paramsUnlinked.first + paramsUnlinked.max - 1,
              });
            }}
            onPreviousClick={() =>
              setParamsUnlinked({
                ...paramsUnlinked,
                first: paramsUnlinked.first - paramsUnlinked.max + 1,
              })
            }
            onPerPageSelect={(first, max) =>
              setParamsUnlinked({
                ...paramsUnlinked,
                first,
                max,
              })
            }
            hasNext={unlinkedAccounts.length > paramsUnlinked.max - 1}
          />
          <div
            id="unlinked-idps"
            aria-label={t("unlinkedLoginProviders")}
            className="divide-y rounded-md border"
          >
            {unlinkedAccounts.length > 0 ? (
              unlinkedAccounts.map(
                (account, index) =>
                  index !== paramsUnlinked.max - 1 && (
                    <AccountRow
                      key={account.providerName}
                      account={account}
                      refresh={refresh}
                    />
                  ),
              )
            ) : (
              <EmptyRow message={t("unlinkedEmpty")} />
            )}
          </div>
        </section>
      </div>
    </Page>
  );
}
