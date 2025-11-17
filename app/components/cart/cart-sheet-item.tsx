import React from "react";
import Button from "../custom-components/button";
import { removeCartItem, updateCartItem } from "~/api/http-requests";
import { useRefreshCart } from "~/hooks/use-cart";
import { toast } from "sonner";
import formatMoney from "~/lib/format-money";

export type CartSheetItemProps = {
    item: CartItem;
}

let timeout: NodeJS.Timeout | null;

export default function ({ item }: CartSheetItemProps) {
    const variantSnapshot: VariantSnapshot = JSON.parse(item.variant_snapshot);
    const productSnapshot: ProductSnapshot = JSON.parse(item.product_snapshot);
    const variantOptionsSnapshot: VariantOptionsSnapshot = JSON.parse(item.variant_options_snapshot);

    const refreshCart = useRefreshCart();

    const [count, setCount] = React.useState(item.count);

    const onCountChange = React.useCallback((newCount: number) => {
        if (newCount < 1) return;

        setCount(newCount);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            const loadingToast = toast.loading('Updating cart item...');

            updateCartItem(item.id, { count: newCount })
                .then(async () => {
                    refreshCart()
                        .then(() => {
                            toast.dismiss(loadingToast);
                            toast.success('Cart item updated.');
                        })
                })
                .finally(() => { timeout = null });
        }, 500);
    }, [item.count]);

    const onRemove = React.useCallback(() => {
        const loadingToast = toast.loading('Removing cart item...');
        removeCartItem(item.id)
            .then(() => {
                refreshCart()
                    .then(() => {
                        toast.dismiss(loadingToast);
                        toast.success('Cart item removed.');
                    })
            })
    }, []);


    return (
        <div key={item.id} className="flex gap-3 rounded-xl border p-3">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                {variantSnapshot.image ? (
                    <img
                        src={variantSnapshot.image}
                        alt={productSnapshot.title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span className="text-xs opacity-60">No Image</span>
                )}
            </div>

            <div className="flex-1">
                <div className="font-medium text-sm">{productSnapshot.title}</div>

                <div className="text-xs opacity-70 mt-1">
                    {Object.entries(variantOptionsSnapshot).map(([group, value]) => (
                        <div key={group}>
                            {group}: {value}
                        </div>
                    ))}
                </div>

                <div className="text-sm font-semibold mt-2">
                    {formatMoney(item.unit_price)}
                </div>

                <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => onCountChange(--item.count)}>
                        -
                    </Button>
                    <span className="text-sm w-6 text-center">{count}</span>
                    <Button size="sm" variant="outline" onClick={() => onCountChange(++item.count)}>
                        +
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    className="text-red-500 mt-2 px-0"
                    onClick={onRemove}
                >
                    Remove
                </Button>
            </div>
        </div>
    );
}