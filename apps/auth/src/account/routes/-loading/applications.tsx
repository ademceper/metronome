import { Skeleton } from "@metronome/ui/components/skeleton";
import { useTranslation } from "react-i18next";
import { Page } from "../../components/page";

export function ApplicationsLoading() {
  const { t } = useTranslation();
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
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[2rem_2fr_2fr_1fr] items-center gap-2 px-4 py-3"
            >
              <Skeleton className="size-6 rounded-md" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
