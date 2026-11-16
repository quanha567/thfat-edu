import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mx-auto grid max-w-2xl grid-cols-3 items-end gap-4 pt-8">
        <Skeleton className="h-44 w-full rounded-t-2xl" />
        <Skeleton className="h-56 w-full rounded-t-2xl" />
        <Skeleton className="h-36 w-full rounded-t-2xl" />
      </div>
      <div className="space-y-3 pt-6">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
