// routes/checkout/components/address/address-list-skeleton.tsx
import { Skeleton } from "~/components/ui/skeleton";

export default function AddressListSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}