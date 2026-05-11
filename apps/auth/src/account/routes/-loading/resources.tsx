/* eslint-disable */
// @ts-nocheck

import { Skeleton } from "@metronome/ui/components/skeleton";
import { useTranslation } from "react-i18next";

export function ResourcesTabLoading() {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Skeleton className="h-9 w-full max-w-xs" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="size-8" />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <div className="grid grid-cols-[2rem_2fr_2fr_2fr_max-content] items-center gap-2 border-b bg-muted/40 px-4 py-3 font-medium text-sm">
          <span aria-hidden />
          <span>{t("resourceName")}</span>
          <span>{t("application")}</span>
          <span>{t("permissionRequests")}</span>
          <span aria-hidden />
        </div>
        <div className="divide-y">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[2rem_2fr_2fr_2fr_max-content] items-center gap-2 px-4 py-3"
            >
              <Skeleton className="size-6 rounded-md" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <div className="flex shrink-0 items-center gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="size-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
