// routes/checkout/components/shipping/shipping-method-skeleton.tsx
import { Skeleton } from "~/components/ui/skeleton";

export default function ShippingMethodSkeleton() {
    return (
        <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border-2 border-transparent bg-muted/20 p-5">
                    <div className="flex items-center gap-4 w-3/4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-1/3 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="h-7 w-16 rounded-md" />
                </div>
            ))}
        </div>
    );
}