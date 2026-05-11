import { Skeleton } from "@metronome/ui/components/skeleton";
import { useTranslation } from "react-i18next";
import { Page } from "../../components/Page";

export function OrganizationsLoading() {
  const { t } = useTranslation();
  return (
    <Page title={t("organizations")} description={t("organizationDescription")}>
      <div className="overflow-hidden rounded-md border">
        <div className="grid grid-cols-[2fr_2fr_2fr_1fr] items-center gap-2 border-b bg-muted/40 px-4 py-3 font-medium text-sm">
          <span>{t("name")}</span>
          <span>{t("domains")}</span>
          <span>{t("description")}</span>
          <span>{t("membershipType")}</span>
        </div>
        <div className="divide-y">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[2fr_2fr_2fr_1fr] items-center gap-2 px-4 py-3"
            >
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
