/* eslint-disable */
// @ts-nocheck

import { Skeleton } from "@metronome/ui/components/skeleton";
import { useTranslation } from "react-i18next";
import { Page } from "../../../components/Page";

export function SigningInLoading() {
  const { t } = useTranslation();
  return (
    <Page title={t("signingIn")} description={t("signingInDescription")}>
      <div className="space-y-8">
        {[0, 1].map((cat) => (
          <section key={cat} className="space-y-6">
            <Skeleton className="h-6 w-32" />
            {[0, 1].map((c) => (
              <div key={c} className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-4 w-24 shrink-0" />
                </div>
                <div className="divide-y rounded-md border">
                  {[0, 1].map((r) => (
                    <div key={r} className="flex items-center gap-4 px-4 py-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-8 w-16 shrink-0" />
                      <Skeleton className="h-8 w-16 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </Page>
  );
}
