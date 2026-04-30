// routes/checkout/components/shipping/shipping-method-skeleton.tsx
import { Skeleton } from "~/components/ui/skeleton";

export default function ShippingMethodSkeleton() {
    return (
        <div className="grid gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border rounded-xl p-4 flex justify-between">
                    <div className="space-y-2 w-3/4">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                </div>
            ))}
        </div>
    );
}