// routes/checkout/components/address/address-list-skeleton.tsx
import { Skeleton } from "~/components/ui/skeleton";

export default function AddressListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-xl border-2 border-transparent bg-muted/20 p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>
          <div className="space-y-2 mt-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}