/* eslint-disable */
// @ts-nocheck

import { Skeleton } from "@metronome/ui/components/skeleton";

export function RouteFallback() {
  return (
    <div className="space-y-6 px-4 py-3">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="divide-y rounded-md border">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
