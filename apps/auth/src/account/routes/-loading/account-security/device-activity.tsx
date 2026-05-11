import { Skeleton } from "@metronome/ui/components/skeleton";
import { useTranslation } from "react-i18next";
import { Page } from "../../../components/Page";

export function DeviceActivityLoading() {
  const { t } = useTranslation();
  return (
    <Page
      title={t("deviceActivity")}
      description={t("signedInDevicesExplanation")}
      action={
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      }
    >
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="divide-y rounded-md border">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-3 px-4 py-3">
              <div className="flex items-start gap-3">
                <Skeleton className="size-5" />
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Skeleton className="h-4 w-64" />
                  {i === 0 && <Skeleton className="h-5 w-24 rounded-full" />}
                </div>
                {i !== 0 && <Skeleton className="h-9 w-20" />}
              </div>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4].map((k) => (
                  <div key={k} className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
