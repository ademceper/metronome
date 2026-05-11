/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/LinkedAccounts.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLinkedAccounts, LinkedAccountQueryParams } from "../api/methods";
import { LinkedAccountRepresentation } from "../api/representations";
import { EmptyRow } from "../components/datalist/EmptyRow";
import { Page } from "../components/page/Page";
import { usePromise } from "../utils/usePromise";
import { AccountRow } from "./AccountRow";
import { LinkedAccountsToolbar } from "./LinkedAccountsToolbar";


const DataList = ({ children, className, ...props }: any) => (
  <div className={cn("divide-y rounded-md border", className)} {...props}>{children}</div>
);
const Stack = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const StackItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
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

export const LinkedAccounts = () => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const [linkedAccounts, setLinkedAccounts] = useState<
    LinkedAccountRepresentation[]
  >([]);
  const [unlinkedAccounts, setUninkedAccounts] = useState<
    LinkedAccountRepresentation[]
  >([]);

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
  const [key, setKey] = useState(1);
  const refresh = () => setKey(key + 1);

  usePromise(
    (signal) => getLinkedAccounts({ signal, context }, paramsUnlinked),
    setUninkedAccounts,
    [paramsUnlinked, key],
  );

  usePromise(
    (signal) => getLinkedAccounts({ signal, context }, paramsLinked),
    setLinkedAccounts,
    [paramsLinked, key],
  );

  return (
    <Page
      title={t("linkedAccounts")}
      description={t("linkedAccountsIntroMessage")}
    >
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2" className="pf-v5-u-mb-lg" size="xl">
            {t("linkedLoginProviders")}
          </Title>
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
          <DataList id="linked-idps" aria-label={t("linkedLoginProviders")}>
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
          </DataList>
        </StackItem>
        <StackItem>
          <Title
            headingLevel="h2"
            className="pf-v5-u-mt-xl pf-v5-u-mb-lg"
            size="xl"
          >
            {t("unlinkedLoginProviders")}
          </Title>
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
          <DataList id="unlinked-idps" aria-label={t("unlinkedLoginProviders")}>
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
          </DataList>
        </StackItem>
      </Stack>
    </Page>
  );
};

export default LinkedAccounts;
