import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="animate-in fade-in-50 flex flex-1 flex-col gap-6 p-4 md:p-6 lg:px-8 lg:py-6">
      {/* Header Skeleton */}
      <div className="border-border/70 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["kpi-1", "kpi-2", "kpi-3", "kpi-4"].map((key) => (
          <Card key={key} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="mt-2 h-10 w-full rounded-b-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="border-border bg-card lg:col-span-7">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-60 w-full rounded-md" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card lg:col-span-5">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-60 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* Tables Skeleton */}
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="border-border bg-card lg:col-span-8">
          <CardHeader>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
