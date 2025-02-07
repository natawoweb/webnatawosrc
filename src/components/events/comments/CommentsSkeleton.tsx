
import { Skeleton } from "@/components/ui/skeleton";

export function CommentsSkeleton() {
  return (
    <>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </>
  );
}
