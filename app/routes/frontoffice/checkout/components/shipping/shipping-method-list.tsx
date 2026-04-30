import { cn } from "~/lib/utils";
import { Truck, BadgeCheck } from "lucide-react";
import useCheckoutStore from "../../stores/use-checkout-store";
import { useFormatMoney } from "~/lib/format-money";

type Props = {
    methods: { method: ShippingMethod; cost: number }[];
    selectedId: number | null;
    onSelect: (id: number) => void;
};

export default function ShippingMethodList({ methods, selectedId, onSelect }: Props) {
    const { setShippingCost } = useCheckoutStore();
    const formatMoney = useFormatMoney();

    const handleSelect = (id: number, cost: number) => {
        onSelect(id);
        setShippingCost(cost);
    };

    if (methods.length === 0) {
        return <div className="text-center py-12 text-muted-foreground border rounded-xl">No shipping methods available.</div>;
    }

    return (
        <ul className="grid gap-3">
            {methods.map(({ method, cost }) => (
                <li key={method.id}>
                    <button
                        type="button"
                        className={cn(
                            "w-full text-left border rounded-xl p-4 transition-colors hover:border-primary/50",
                            selectedId === method.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-border"
                        )}
                        onClick={() => handleSelect(method.id, cost)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-semibold">{method.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {method.carrier} ·{" "}
                                        {method.min_delivery_days !== undefined && method.max_delivery_days !== undefined
                                            ? `${method.min_delivery_days}–${method.max_delivery_days} business days`
                                            : "Delivery time not specified"}
                                    </p>
                                    {method.free_shipping_threshold && cost === 0 && (
                                        <span className="mt-1 inline-flex items-center text-xs text-green-600">
                                            <BadgeCheck className="mr-1 h-3 w-3" /> Free shipping
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right font-semibold">{formatMoney(cost)}</div>
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
}