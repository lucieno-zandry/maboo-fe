import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function AddressListSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2].map((i) => (
        <Card key={i} className="relative border-muted opacity-60">
          <div className="flex items-start gap-4 p-4">
            {/* Radio Button Circle Skeleton */}
            <Skeleton className="mt-1 h-4 w-4 rounded-full" />

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                {/* Name Skeleton */}
                <Skeleton className="h-4 w-1/3" />
                {/* Badge Skeleton (Optional) */}
                {i === 1 && <Skeleton className="h-4 w-12 rounded-full" />}
              </div>

              <div className="space-y-1">
                {/* Address Line 1 Skeleton */}
                <Skeleton className="h-3 w-3/4" />
                {/* Address Line 2 Skeleton */}
                <Skeleton className="h-3 w-1/2" />
              </div>

              {/* Phone Number Skeleton */}
              <div className="pt-1">
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}