import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyRow } from "../../components/empty-row";
import { Page } from "../../components/page";
import { useLinkedAccounts } from "../../lib/api";
import { LinkedAccountQueryParams } from "../../lib/api";
import { AccountRow } from "./-AccountRow";
import { LinkedAccountsToolbar } from "./-LinkedAccountsToolbar";

export const Route = createFileRoute("/account-security/linked-accounts")({
  component: LinkedAccounts,
});

function LinkedAccounts() {
  const { t } = useTranslation();

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

  const { data: linkedAccounts = [] } = useLinkedAccounts(paramsLinked);
  const { data: unlinkedAccounts = [] } = useLinkedAccounts(paramsUnlinked);

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
