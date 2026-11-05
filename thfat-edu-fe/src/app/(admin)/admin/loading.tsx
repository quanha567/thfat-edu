import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["metric-1", "metric-2", "metric-3", "metric-4"].map((id) => (
          <Skeleton key={id} className="h-28 rounded-xl" />
        ))}
      </div>

      <Skeleton className="min-h-75 flex-1 rounded-xl" />
    </div>
  );
}
