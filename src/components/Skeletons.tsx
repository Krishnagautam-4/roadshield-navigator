import { Skeleton } from "@/components/ui/skeleton";

export function MapSkeleton({ className = "h-full w-full" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Skeleton className="h-full w-full rounded-2xl" />
      <p className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
        Loading map…
      </p>
    </div>
  );
}

export function StatRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}

export function ChartGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-2xl" />
      ))}
    </div>
  );
}
