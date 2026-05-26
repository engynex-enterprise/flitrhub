import { Card } from "@/shared/components/ui/card";

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-[3/4] w-full animate-pulse bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </Card>
  );
}
