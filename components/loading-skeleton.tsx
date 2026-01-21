export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card/80 p-6">
      <div className="h-48 w-full rounded-lg bg-muted mb-4" />
      <div className="h-4 w-20 rounded bg-muted mb-2" />
      <div className="h-6 w-3/4 rounded bg-muted mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
      <div className="h-4 w-24 rounded bg-muted" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card/80 p-6">
      <div className="h-64 w-full rounded-lg bg-muted mb-4" />
      <div className="h-6 w-2/3 rounded bg-muted mb-2" />
      <div className="h-4 w-full rounded bg-muted mb-1" />
      <div className="h-4 w-4/5 rounded bg-muted" />
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card/80 p-6">
      <div className="h-12 w-12 rounded-lg bg-muted mb-4" />
      <div className="h-6 w-3/4 rounded bg-muted mb-3" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}
